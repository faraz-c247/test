# 📋 Service & Hook Pattern Example

This document shows the updated pattern we follow for services and hooks, similar to your document example.

## 🔧 Service Class Pattern

```typescript
// services/example/Example.ts
import apiClient from '@/lib/apiClient';
import { API_ROUTES } from '@/constants/routes';

export interface CreateExampleRequest {
  name: string;
  description: string;
}

export interface UpdateExampleRequest {
  id: string;
  name: string;
  description: string;
}

export class ExampleService {
  getAll(params: { page?: number; limit?: number }) {
    return apiClient.get(API_ROUTES.EXAMPLES.LIST, {
      params,
    });
  }

  get({ id }: { id: string }) {
    return apiClient.get(API_ROUTES.EXAMPLES.DETAIL.replace(':id', id));
  }

  create(payload: CreateExampleRequest) {
    return apiClient.post(API_ROUTES.EXAMPLES.LIST, payload);
  }

  update(payload: UpdateExampleRequest) {
    return apiClient.put(
      API_ROUTES.EXAMPLES.DETAIL.replace(':id', payload.id),
      payload
    );
  }

  delete({ id }: { id: string }) {
    return apiClient.delete(API_ROUTES.EXAMPLES.DETAIL.replace(':id', id));
  }
}
```

## 🎣 Hook Pattern

```typescript
// hooks/useExample.ts
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExampleService } from "@/services/example/Example";
import type {
  CreateExampleRequest,
  UpdateExampleRequest,
} from "@/services/example/Example";

const EXAMPLE_KEY = {
  EXAMPLES: "examples",
  EXAMPLE_DETAIL: "example-detail",
};

const exampleService = new ExampleService();

// Query hooks
export const useAllExamplesQuery = (params: { page?: number; limit?: number }) => {
  const allExamplesQueryKey = [EXAMPLE_KEY.EXAMPLES, params];

  const query = useQuery({
    queryKey: allExamplesQueryKey,
    queryFn: () => exampleService.getAll(params),
    keepPreviousData: true,
  });

  const invalidateAllExamplesQuery = useMutation({
    mutationFn: () => {
      queryClient.invalidateQueries({ queryKey: allExamplesQueryKey });
    },
  });

  return {
    ...query,
    invalidateAllExamplesQuery,
  };
};

export const useExampleQuery = ({ id }: { id: string }) =>
  useQuery({
    queryKey: [EXAMPLE_KEY.EXAMPLE_DETAIL, { id }],
    queryFn: () => exampleService.get({ id }),
    enabled: !!id,
  });

// Mutation hooks
export const useCreateExampleMutation = () => {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (input: CreateExampleRequest) => {
      return exampleService.create(input);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [EXAMPLE_KEY.EXAMPLES] });
      return data;
    },
    onError: (error) => {
      let errorMessage = "Failed to create example";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return errorMessage;
    },
  });

  return { ...mutation, progress };
};

export const useUpdateExampleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateExampleRequest) => {
      return exampleService.update(input);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [EXAMPLE_KEY.EXAMPLES] });
      queryClient.invalidateQueries({ 
        queryKey: [EXAMPLE_KEY.EXAMPLE_DETAIL, { id: data.id }] 
      });
      return data;
    },
    onError: (error) => {
      let errorMessage = "Failed to update example";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return errorMessage;
    },
  });
};

export const useDeleteExampleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string }) => exampleService.delete(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [EXAMPLE_KEY.EXAMPLES] });
      return data;
    },
    onError: (error) => {
      let errorMessage = "Failed to delete example";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return errorMessage;
    },
  });
};
```

## 🎯 Key Patterns

### 1. **Service Class Structure**
- ✅ Direct class without inheritance
- ✅ Uses `apiClient` directly
- ✅ Consistent method naming (`get`, `getAll`, `create`, `update`, `delete`)
- ✅ Proper payload typing with interfaces

### 2. **Hook Naming Convention**
- ✅ Queries: `use[Entity]Query` / `useAll[Entity]Query`
- ✅ Mutations: `use[Action][Entity]Mutation`
- ✅ Clear, descriptive names

### 3. **Query Key Management**
- ✅ Simple string-based keys
- ✅ Consistent key structure
- ✅ Parameters included in query keys

### 4. **Error Handling**
- ✅ Consistent error message patterns
- ✅ Type-safe error checking
- ✅ Return error messages from mutations

### 5. **State Management**
- ✅ Progress state for upload operations
- ✅ Query invalidation on success
- ✅ Proper cleanup and updates

## 🔄 Usage Example

```typescript
// In a component
const ExampleList: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useAllExamplesQuery({ page, limit: 10 });
  const createMutation = useCreateExampleMutation();
  const deleteMutation = useDeleteExampleMutation();

  const handleCreate = (formData: CreateExampleRequest) => {
    createMutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data?.map(item => (
        <ExampleCard 
          key={item.id} 
          item={item} 
          onDelete={() => handleDelete(item.id)}
        />
      ))}
    </div>
  );
};
```

---

**This pattern provides:**
- Clear separation of concerns
- Consistent API across features
- Type safety throughout
- Easy testing and maintenance
- Predictable hook behavior 