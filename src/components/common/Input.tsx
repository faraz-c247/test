"use client";

import React, { forwardRef, useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  size?: "sm" | "lg";
  variant?: "default" | "filled" | "outlined";

  // Input group props
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;

  // Special input types
  showPasswordToggle?: boolean;
  clearable?: boolean;

  // Styling
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;

  // Validation
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  validator?: (value: string) => string | undefined;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      required = false,
      size,
      variant = "default",

      // Input group props
      prefix,
      suffix,
      addonBefore,
      addonAfter,

      // Special input types
      showPasswordToggle = false,
      clearable = false,

      // Styling
      containerClassName = "",
      labelClassName = "",
      inputClassName = "",

      // Validation
      validateOnBlur = false,
      validateOnChange = false,
      validator,

      // Standard props
      type = "text",
      className,
      value,
      onChange,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalError, setInternalError] = useState<string | undefined>();

    const finalError = error || internalError;
    const inputType = type === "password" && showPassword ? "text" : type;

    const handleValidation = (inputValue: string) => {
      if (validator) {
        const validationError = validator(inputValue);
        setInternalError(validationError);
        return validationError;
      }
      return undefined;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (validateOnChange) {
        handleValidation(e.target.value);
      }
      onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (validateOnBlur) {
        handleValidation(e.target.value);
      }
      onBlur?.(e);
    };

    const handleClear = () => {
      if (onChange) {
        const event = {
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    const renderInput = () => {
      const inputElement = (
        <Form.Control
          ref={ref}
          type={inputType}
          size={size}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={!!finalError}
          className={`${inputClassName} ${
            variant === "filled" ? "bg-light" : ""
          } ${variant === "outlined" ? "border-2" : ""}`}
          {...rest}
        />
      );

      // Simple input without any addons
      if (
        !prefix &&
        !suffix &&
        !addonBefore &&
        !addonAfter &&
        !showPasswordToggle &&
        !clearable
      ) {
        return inputElement;
      }

      // Input with group elements
      return (
        <InputGroup hasValidation>
          {addonBefore && <InputGroup.Text>{addonBefore}</InputGroup.Text>}

          {prefix && <InputGroup.Text>{prefix}</InputGroup.Text>}

          {inputElement}

          {clearable && value && (
            <Button
              variant="outline-secondary"
              onClick={handleClear}
              size={size}
            >
              ✕
            </Button>
          )}

          {showPasswordToggle && type === "password" && (
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              size={size}
            >
              {showPassword ? "🙈" : "👁️"}
            </Button>
          )}

          {suffix && <InputGroup.Text>{suffix}</InputGroup.Text>}

          {addonAfter && <InputGroup.Text>{addonAfter}</InputGroup.Text>}
        </InputGroup>
      );
    };

    return (
      <Form.Group className={containerClassName}>
        {label && (
          <Form.Label
            className={`${labelClassName} ${required ? "required" : ""}`}
          >
            {label}
            {required && <span className="text-danger ms-1">*</span>}
          </Form.Label>
        )}

        {renderInput()}

        {finalError && (
          <Form.Control.Feedback type="invalid" className="d-block">
            {finalError}
          </Form.Control.Feedback>
        )}

        {helperText && !finalError && (
          <Form.Text className="text-muted">{helperText}</Form.Text>
        )}
      </Form.Group>
    );
  }
);

Input.displayName = "Input";

export default Input;

// Specialized Input Components

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  size?: "sm" | "lg";
  resize?: "none" | "both" | "horizontal" | "vertical";

  // Styling
  containerClassName?: string;
  labelClassName?: string;

  // Auto-resize
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      required = false,
      size,
      resize = "vertical",

      // Styling
      containerClassName = "",
      labelClassName = "",

      // Auto-resize
      autoResize = false,
      minRows = 3,
      maxRows = 10,

      // Standard props
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    const textareaStyle = {
      resize,
      ...style,
    };

    return (
      <Form.Group className={containerClassName}>
        {label && (
          <Form.Label
            className={`${labelClassName} ${required ? "required" : ""}`}
          >
            {label}
            {required && <span className="text-danger ms-1">*</span>}
          </Form.Label>
        )}

        <Form.Control
          ref={ref}
          as="textarea"
          rows={minRows}
          size={size}
          isInvalid={!!error}
          className={className}
          style={textareaStyle}
          {...rest}
        />

        {error && (
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        )}

        {helperText && !error && (
          <Form.Text className="text-muted">{helperText}</Form.Text>
        )}
      </Form.Group>
    );
  }
);

TextArea.displayName = "TextArea";

// Number Input Component
export interface NumberInputProps extends Omit<InputProps, "type"> {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  showControls?: boolean;
  formatter?: (value: number) => string;
  parser?: (value: string) => number;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      min,
      max,
      step = 1,
      precision,
      showControls = true,
      formatter,
      parser,
      value,
      onChange,
      ...rest
    },
    ref
  ) => {
    const handleIncrement = () => {
      const currentValue =
        typeof value === "string"
          ? parseFloat(value) || 0
          : (value as number) || 0;
      const newValue = Math.min(currentValue + step, max ?? Infinity);
      const event = {
        target: { value: newValue.toString() },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(event);
    };

    const handleDecrement = () => {
      const currentValue =
        typeof value === "string"
          ? parseFloat(value) || 0
          : (value as number) || 0;
      const newValue = Math.max(currentValue - step, min ?? -Infinity);
      const event = {
        target: { value: newValue.toString() },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(event);
    };

    const displayValue =
      formatter && typeof value === "number" ? formatter(value) : value;

    return (
      <Input
        ref={ref}
        type="number"
        min={min}
        max={max}
        step={step}
        value={displayValue}
        onChange={onChange}
        suffix={
          showControls ? (
            <div className="d-flex flex-column">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleIncrement}
                style={{
                  fontSize: "0.7rem",
                  padding: "0.1rem 0.3rem",
                  lineHeight: 1,
                }}
              >
                ▲
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleDecrement}
                style={{
                  fontSize: "0.7rem",
                  padding: "0.1rem 0.3rem",
                  lineHeight: 1,
                }}
              >
                ▼
              </Button>
            </div>
          ) : undefined
        }
        {...rest}
      />
    );
  }
);

NumberInput.displayName = "NumberInput";

// Search Input Component
export interface SearchInputProps extends Omit<InputProps, "type"> {
  onSearch?: (value: string) => void;
  searchDelay?: number;
  showSearchButton?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      onSearch,
      searchDelay = 300,
      showSearchButton = true,
      placeholder = "Search...",
      ...rest
    },
    ref
  ) => {
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();

    const handleSearch = (value: string) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        onSearch?.(value);
      }, searchDelay);

      setSearchTimeout(timeout);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      rest.onChange?.(e);
      handleSearch(e.target.value);
    };

    const handleSearchClick = () => {
      const value = typeof rest.value === "string" ? rest.value : "";
      onSearch?.(value);
    };

    return (
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        prefix="🔍"
        suffix={
          showSearchButton ? (
            <Button variant="primary" size="sm" onClick={handleSearchClick}>
              Search
            </Button>
          ) : undefined
        }
        onChange={handleChange}
        {...rest}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";
