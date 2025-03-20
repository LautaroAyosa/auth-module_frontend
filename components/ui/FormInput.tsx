// components/FormInput.tsx
import React, { useState } from "react";
import { Eye, EyeOff } from 'lucide-react'

interface FormInputProps {
  label: string;
  type: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder: string;
  description?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, type, value, onChange, required = false, placeholder, description }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toSnakeCase = (str:string) => {
    return str.toLowerCase().replace(/\s+/g, '_').replace(/[^\w_]/g, '');
  }
  const fieldId = toSnakeCase(label);
  const toggleVisibility = () => setIsVisible(prevState => !prevState);

  return (
    <div className="mb-4">
      <label className="block text-base font-medium text-gray-900">{label}</label>
      { type === 'password' ? 
        <div className="relative">
          <input
            id={fieldId}
            type={isVisible ? "text" : "password"}
            className="w-full text-sm text-slate-600 bg-white border border-slate-300 appearance-none rounded-lg ps-3.5 pe-10 py-2.5 outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-indigo-100"
            placeholder={placeholder}
            onChange={onChange}
            aria-label="Password"
            required={required == undefined ? true : required}
          />
          <button
            className="absolute inset-y-0 end-0 flex items-center z-20 px-2.5 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus-visible:text-blue-500 hover:text-blue-500 transition-colors"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            aria-controls="password"
          >
            {isVisible ? (
              <EyeOff size={20} aria-hidden="true" />
            ) : (
              <Eye size={20} aria-hidden="true" />
            )}
          </button>
        </div>
        : <input
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full text-sm text-slate-600 bg-white border border-slate-300 appearance-none rounded-lg ps-3.5 pe-10 py-2.5 outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-indigo-100"
            placeholder={placeholder}
          />
      }
      { description ? <p className="text-gray-400 text-xs mt-2">{description}</p> : ""}
    </div>
  );
};

export default FormInput;