import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FORM_FIELDS = [
  { name: "fullName", label: "Full name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "company", label: "Company", type: "text" },
  { name: "message", label: "Message", type: "textarea" },
];

const CONTACT_INFO = [
  { label: "Address", value: "110, 16th Road, Chembur, Mumbai - 400071" },
  { label: "Phone", value: "+91 22 25208822" },
  { label: "Email", value: "info@supremegroup.co.in" },
];

type FormData = {
  fullName: string;
  email: string;
  company: string;
  message: string;
};

type FormErrors = {
  [key in keyof FormData]?: string;
};

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputBaseClass =
    "sg-translate text-white placeholder:text-opacity-90 focus-visible:border-opacity-100 " +
    "border-white border-opacity-40 placeholder:sg-translate transition-all duration-200 " +
    "tracking-wide ease-in-out border-b-2 border-solid py-2 pr-2 w-full text-base lg:text-lg " +
    "placeholder:text-white font-normal bg-transparent outline-none focus-visible:outline-none";

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required";
      isValid = false;
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      setTimeout(() => {
        toast.success("Form submitted successfully!");
        setIsSubmitting(false);
        setFormData({ fullName: "", email: "", company: "", message: "" });
      }, 2000);
    }
  };

  const renderFormField = (field: (typeof FORM_FIELDS)[0], index: number) => {
    const { name, label, type } = field;
    const value = formData[name as keyof FormData];
    const errorMessage = errors[name as keyof FormData];

    return (
      <div key={`field-${index}`} className="mb-4">
        {type === "textarea" ? (
          <textarea
            name={name}
            placeholder={label}
            value={value}
            onChange={handleChange}
            className={inputBaseClass}
          />
        ) : (
          <input
            type={type}
            name={name}
            placeholder={label}
            value={value}
            onChange={handleChange}
            className={inputBaseClass}
          />
        )}
        {errorMessage && (
          <p className="text-red-400 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
    );
  };

  return (
    <section className="bg-[#006abc] text-white py-20 px-6 md:px-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-semibold">Get in touch</h2>
          <div className="h-[2px] w-12 bg-white my-3 md:my-5 lg:my-6 2xl:my-8"></div>
          <p className="sg-translate block font-normal text-base md:text-lg 2xl:text-2xl">
            For general enquiries
          </p>

          <div className="mt-6 space-y-4">
            {CONTACT_INFO.map((item, index) => (
              <p key={`contact-${index}`}>
                <span className="sg-translate font-medium text-lg md:text-lg xl:text-xl">
                  {item.label}:
                </span>
                <br /> {item.value}
              </p>
            ))}
          </div>
        </div>

        <form className="w-full md:w-1/2" onSubmit={handleSubmit}>
          {FORM_FIELDS.map(renderFormField)}

          <button
            type="submit"
            className="border-2 border-white py-2 px-8 rounded-full mt-6 hover:bg-white hover:text-blue-600 transition duration-300 disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
