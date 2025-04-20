import { InputText } from "primereact/inputtext";

export default function Input_Component({
  value,
  onChange,
  placeholder = "Enter text",
  className = "",
  ...props
}) {
  return (
    <div className={`card flex justify-content-center max-w-full ${className}`}>
      <InputText
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
        className="w-full"
      />
    </div>
  );
}
