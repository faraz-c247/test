"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import RGPA, { geocodeByPlaceId } from "react-google-places-autocomplete";

/**
 * Normalized address returned from Google Places selection.
 */
export type StructuredAddress = {
  formattedAddress: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
};

export interface GooglePlacesAutocompleteProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /** Called with normalized address data when a place is selected. */
  onPlaceSelect?: (address: StructuredAddress) => void;
  /** Called when initialization or place_changed handler throws. */
  onError?: (error: unknown) => void;
  /** Controlled text value (mirrors the visible input). */
  value?: string;
  /** Controlled change handler to mirror text. */
  onChange?: (value: string) => void;
  /** Country restriction for predictions (default: ["us"]). */
  countries?: string[];
}

/** Minimal option type from react-google-places-autocomplete */
interface RGPAOptionValue {
  place_id?: string;
  [key: string]: unknown;
}

interface RGPAOption {
  label: string;
  value?: RGPAOptionValue;
  [key: string]: unknown;
}

/**
 * Extracts a simplified/structured address from a PlaceResult obtained via Places Details API.
 */
function extractAddressComponents(
  place: google.maps.places.PlaceResult
): StructuredAddress {
  const components = place.address_components ?? [];
  const get = (type: string): string => {
    const comp = components.find((c) => (c.types || []).includes(type));
    return comp?.long_name || "";
  };

  const streetNumber = get("street_number");
  const route = get("route");
  const street = [streetNumber, route].filter(Boolean).join(" ");

  const city =
    get("locality") || get("sublocality") || get("administrative_area_level_2");
  const state = get("administrative_area_level_1");
  const zipCode = get("postal_code");
  const country = get("country");

  return {
    formattedAddress: place.formatted_address || "",
    street,
    city,
    state,
    zipCode,
    country,
    latitude: place.geometry?.location?.lat(),
    longitude: place.geometry?.location?.lng(),
  };
}

/**
 * Google Places Autocomplete (react-google-places-autocomplete powered).
 * - Handles script loading using the library via apiKey.
 * - On select, fetches details (address_components, geometry) to produce a StructuredAddress.
 */
const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  placeholder = "Property Address",
  className,
  value,
  onChange,
  onPlaceSelect,
  onError,
  countries = ["us"],
  style,
  ...rest
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const [internalText, setInternalText] = useState<string>(value ?? "");
  const [selectedOption, setSelectedOption] = useState<RGPAOption | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Keep internal text in sync with external value
  useEffect(() => {
    if (typeof value === "string" && value !== internalText) {
      setInternalText(value);
    }
  }, [value]);

  const autocompletionRequest = useMemo(
    () => ({
      componentRestrictions: { country: countries },
    }),
    [countries]
  );

  const handleSelect = async (option: RGPAOption | null) => {
    try {
      setSelectedOption(option);
      const placeId: string | undefined = option?.value?.place_id;
      const label: string | undefined = option?.label;
      if (!placeId) {
        // Fallback: just set text
        if (label) {
          setInternalText(label);
          onChange?.(label);
        }
        return;
      }

      // Ensure google namespace is available (library loads script with apiKey)
      const googleNs = (window as unknown as { google?: typeof google }).google;
      if (!googleNs?.maps?.places) {
        throw new Error(
          "Google Maps Places library not available after selection"
        );
      }

      // Fetch place details using PlacesService so we get address_components and geometry
      const svc = new googleNs.maps.places.PlacesService(
        document.createElement("div")
      );

      const details = await new Promise<google.maps.places.PlaceResult>(
        (resolve, reject) => {
          svc.getDetails(
            {
              placeId,
              fields: ["address_components", "formatted_address", "geometry"],
            },
            (result, status) => {
              if (
                status === googleNs.maps.places.PlacesServiceStatus.OK &&
                result
              ) {
                resolve(result);
              } else {
                reject(new Error(`PlacesService getDetails failed: ${status}`));
              }
            }
          );
        }
      );

      const addr = extractAddressComponents(details);
      setInternalText(addr.formattedAddress || label || "");
      onChange?.(addr.formattedAddress || label || "");
      onPlaceSelect?.(addr);
    } catch (e: unknown) {
      console.error("[Google Places] onSelect error", e);
      onError?.(e);
    }
  };

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <RGPA
        apiKey={apiKey || ""}
        selectProps={{
          // Style RGPA to look like the existing input (inherits container styles)
          placeholder,
          className,
          styles: {
            control: (base) => ({
              ...base,
              border: "none",
              boxShadow: "none",
              height: "100%",
              minHeight: "unset",
              backgroundColor: "transparent",
            }),
            valueContainer: (base) => ({ ...base, padding: "0 10px" }),
            input: (base) => ({ ...base, margin: 0, padding: 0 }),
            indicatorSeparator: () => ({ display: "none" }),
            indicatorsContainer: (base) => ({ ...base, display: "none" }),
          },
          // Keep label text in sync for controlled echo
          inputValue: internalText,
          onInputChange: (text: string) => {
            setInternalText(text);
            onChange?.(text);
          },
          // Show the selected option visually in the dropdown control
          value: selectedOption as unknown as RGPAOption,
          onChange: (opt: unknown) => handleSelect(opt as RGPAOption | null),
        }}
        autocompletionRequest={autocompletionRequest}
        {...rest}
      />
    </div>
  );
};

export default GooglePlacesAutocomplete;
