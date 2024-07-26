import React, { useState } from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ id, label, placeholder, onChange }) => {
  const [value, setValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div className="flex-1">
      <label htmlFor={id} className="block text-[#363636] dark:text-white text-sm font-medium mb-1">{label}</label>
      <input 
        type="text"
        id={id}
        value={value}
        placeholder={placeholder}
        className="h-10 w-full rounded-md bg-[#F7F7F7] dark:bg-[#363636] border-[#DDDDDD] dark:border-[#606060] text-light-white px-4 py-2 text-sm font-semibold !outline-none focus:border focus:border-[#DDDDDD] dark:border-[#606060] focus:ring-transparent"
        onChange={handleChange}
      />
    </div>
  );
};
