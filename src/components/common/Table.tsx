"use client";

import React, { useState, useMemo } from "react";
import { Table as BootstrapTable, Pagination, Form, InputGroup, Button, Badge } from "react-bootstrap";

export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: "left" | "center" | "right";
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
    onChange: (page: number, pageSize: number) => void;
  };
  rowKey?: keyof T | ((record: T) => string | number);
  onRowClick?: (record: T, index: number) => void;
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
  size?: "sm" | "lg";
  responsive?: boolean;
  emptyText?: string;
  className?: string;
}

export default function Table<T = any>({
  columns,
  data,
  loading = false,
  pagination,
  rowKey = "id",
  onRowClick,
  striped = true,
  hover = true,
  bordered = false,
  size,
  responsive = true,
  emptyText = "No data available",
  className = "",
}: TableProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Get row key
  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return record[rowKey] || index;
  };

  // Handle sorting
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;

    if (sortField === column.dataIndex) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(column.dataIndex);
      setSortDirection("asc");
    }
  };

  // Handle filtering
  const handleFilter = (columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
  };

  // Process data (filter and sort)
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        const column = columns.find(col => col.key === key);
        if (column) {
          result = result.filter(record => {
            const fieldValue = record[column.dataIndex];
            return String(fieldValue).toLowerCase().includes(value.toLowerCase());
          });
        }
      }
    });

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue === bValue) return 0;
        
        let comparison = 0;
        if (aValue > bValue) comparison = 1;
        if (aValue < bValue) comparison = -1;
        
        return sortDirection === "desc" ? -comparison : comparison;
      });
    }

    return result;
  }, [data, filters, sortField, sortDirection, columns]);

  // Render sort icon
  const renderSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable) return null;
    
    if (sortField === column.dataIndex) {
      return sortDirection === "asc" ? " ↑" : " ↓";
    }
    return " ↕";
  };

  // Render table content
  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={columns.length} className="text-center py-4">
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-border me-2" role="status" />
              <span>Loading...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (processedData.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length} className="text-center py-4 text-muted">
            {emptyText}
          </td>
        </tr>
      );
    }

    return processedData.map((record, index) => (
      <tr
        key={getRowKey(record, index)}
        onClick={() => onRowClick?.(record, index)}
        style={{ cursor: onRowClick ? "pointer" : "default" }}
      >
        {columns.map((column) => {
          const value = record[column.dataIndex];
          const cellContent = column.render ? column.render(value, record, index) : value;
          
          return (
            <td
              key={column.key}
              style={{ 
                width: column.width,
                textAlign: column.align || "left"
              }}
            >
              {cellContent}
            </td>
          );
        })}
      </tr>
    ));
  };

  // Render filters
  const renderFilters = () => {
    const filterableColumns = columns.filter(col => col.filterable);
    if (filterableColumns.length === 0) return null;

    return (
      <div className="mb-3">
        <div className="row g-2">
          {filterableColumns.map((column) => (
            <div key={column.key} className="col-md-3">
              <InputGroup size="sm">
                <Form.Control
                  type="text"
                  placeholder={`Filter by ${column.title}`}
                  value={filters[column.key] || ""}
                  onChange={(e) => handleFilter(column.key, e.target.value)}
                />
                {filters[column.key] && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleFilter(column.key, "")}
                  >
                    ✕
                  </Button>
                )}
              </InputGroup>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (!pagination) return null;

    const { current, pageSize, total, showSizeChanger, pageSizeOptions, onChange } = pagination;
    const totalPages = Math.ceil(total / pageSize);

    if (totalPages <= 1) return null;

    const items = [];
    const startPage = Math.max(1, current - 2);
    const endPage = Math.min(totalPages, current + 2);

    // Previous button
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={current === 1}
        onClick={() => onChange(current - 1, pageSize)}
      />
    );

    // First page
    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => onChange(1, pageSize)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }
    }

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === current}
          onClick={() => onChange(page, pageSize)}
        >
          {page}
        </Pagination.Item>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => onChange(totalPages, pageSize)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    // Next button
    items.push(
      <Pagination.Next
        key="next"
        disabled={current === totalPages}
        onClick={() => onChange(current + 1, pageSize)}
      />
    );

    return (
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">
          Showing {(current - 1) * pageSize + 1} to {Math.min(current * pageSize, total)} of {total} entries
        </div>
        
        <div className="d-flex align-items-center gap-3">
          {showSizeChanger && pageSizeOptions && (
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted">Show:</span>
              <Form.Select
                size="sm"
                value={pageSize}
                onChange={(e) => onChange(1, parseInt(e.target.value))}
                style={{ width: "auto" }}
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </Form.Select>
            </div>
          )}
          
          <Pagination className="mb-0">{items}</Pagination>
        </div>
      </div>
    );
  };

  const TableComponent = (
    <BootstrapTable
      striped={striped}
      hover={hover}
      bordered={bordered}
      size={size}
      className={className}
    >
      <thead className="table-dark">
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              style={{ 
                width: column.width,
                cursor: column.sortable ? "pointer" : "default"
              }}
              onClick={() => handleSort(column)}
            >
              <div className="d-flex align-items-center justify-content-between">
                <span>{column.title}</span>
                {renderSortIcon(column)}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {renderTableContent()}
      </tbody>
    </BootstrapTable>
  );

  return (
    <div className="table-container">
      {renderFilters()}
      
      {responsive ? (
        <div className="table-responsive">
          {TableComponent}
        </div>
      ) : (
        TableComponent
      )}
      
      {renderPagination()}
    </div>
  );
} 