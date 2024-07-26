import React from "react";
import Select, {
  components,
  SingleValueProps,
  OptionProps as DefaultOptionProps,
} from "react-select";
import { blockchainOptions } from "./blockchainOptions";
import Image from "next/image";
import { useTheme } from "next-themes";

interface Data {
  logo: string;
  label: string;
}

interface CustomSingleValueProps extends SingleValueProps<Data> {}

const getCustomStyles = (theme: string) => ({
  control: (base: any) => ({
    ...base,
    minHeight: 42,
    backgroundColor: theme === "dark" ? "#363636" : "#F7F7F7",
    borderColor: theme === "dark" ? "#363636" : "#F7F7F7",
    boxShadow: "none",
    "&:hover": {
      borderColor: theme === "dark" ? "#606060" : "#aaa",
    },
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: "0 14px",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "gray",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: theme === "dark" ? "#fff" : "#333",
  }),
  option: (base: any, { isFocused, isSelected }: any) => ({
    ...base,
    backgroundColor: isSelected
      ? theme === "dark"
        ? "#272727"
        : "#ddd"
      : isFocused
      ? theme === "dark"
        ? "#333333"
        : "#eee"
      : "transparent",
    color: theme === "dark" ? "#fff" : "#333",
    cursor: "pointer",
    "&:active": {
      backgroundColor: theme === "dark" ? "#444444" : "#ccc",
    },
  }),
  menu: (base: any) => ({
    ...base,
    boxShadow: "none",
    backgroundColor: theme === "dark" ? "#232323" : "white",
    borderColor: theme === "dark" ? "#606060" : "#ccc",
    borderWidth: "1px",
    overflow: "hidden",
  }),
  menuList: (base: any) => ({
    ...base,
    padding: 0,
  }),
});

const customSingleValue = (props: CustomSingleValueProps) => (
  <div className="flex items-center absolute left-[10px]">
    <Image
      src={props.data.logo}
      alt={props.data.label}
      width={30}
      height={30}
      style={{ marginRight: 10, borderRadius: 50 }}
    />
    {props.data.label}
  </div>
);

interface OptionProps extends DefaultOptionProps<Data> {}

const customOption = (props: OptionProps) => (
  <components.Option {...props}>
    <div className="flex items-center">
      <Image
        src={props.data.logo}
        alt={props.data.label}
        width={30}
        height={30}
        style={{ marginRight: 10, borderRadius: 50 }}
      />
      {props.data.label}
    </div>
  </components.Option>
);
interface BlockchainInfo {
  logo: string;
  label: string;
}

interface Props {
  onChange: (value: Data | null) => void;
  value: BlockchainInfo | null;
}

export const SenderBlockchain: React.FC<Props> = ({ onChange, value }) => {
  const { theme } = useTheme();
  const customStyles = getCustomStyles(theme || "light");

  return (
    <Select<Data>
      options={blockchainOptions}
      components={{
        SingleValue: customSingleValue,
        Option: customOption,
        IndicatorSeparator: () => null,
      }}
      styles={customStyles}
      // value={value.}
      className="w-full text-base"
      onChange={(option) => onChange(option ? option : null)}
    />
  );
};

export default SenderBlockchain;
