import React from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Link from "next/link";
import { useForm, FieldValues, Path } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface FormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: string;
  placeholder: string;
}

interface AuthFormProps<T extends FieldValues> {
  title: string;
  subtitle: string;
  linkText: string;
  linkHref: string;
  fields: FormField<T>[];
  onSubmit: (data: T) => void;
  validationSchema: yup.ObjectSchema<T>;
  error?: string;
  message?: string;
  loading?: boolean;
  submitText: string;
  loadingText: string;
  defaultValues?: Partial<T>;
}

export default function AuthForm<T extends FieldValues>({
  title,
  subtitle,
  linkText,
  linkHref,
  fields,
  onSubmit,
  validationSchema,
  error,
  message,
  loading = false,
  submitText,
  loadingText,
  defaultValues,
}: AuthFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: defaultValues as any,
  });

  const isLoading = loading || isSubmitting;

  return (
    <>
      {/* Title section (only show if title is provided) */}
      {title && (
        <div className="text-center mb-4">
          <h2 className="h4 mb-3 fw-bold">{title}</h2>
        </div>
      )}

      {/* Messages */}
      {message && (
        <Alert variant="success" className="mb-3">
          {message}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {/* Form */}
      <Form onSubmit={handleSubmit(onSubmit as any)}>
        {fields.map((field) => (
          <Form.Group key={field.name as string} className="mb-3">
            <Form.Label className="fw-semibold">{field.label}</Form.Label>
            <Form.Control
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.name)}
              isInvalid={!!errors[field.name]}
              disabled={isLoading}
              className="py-2"
            />
            <Form.Control.Feedback type="invalid">
              {errors[field.name]?.message as string}
            </Form.Control.Feedback>
          </Form.Group>
        ))}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-100 mb-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              {loadingText}
            </>
          ) : (
            submitText
          )}
        </Button>
      </Form>

      {/* Footer link */}
      <div className="text-center">
        <p className="text-muted mb-0">
          {subtitle}{" "}
          <Link
            href={linkHref}
            className="text-primary text-decoration-none fw-semibold"
          >
            {linkText}
          </Link>
        </p>
      </div>
    </>
  );
}
