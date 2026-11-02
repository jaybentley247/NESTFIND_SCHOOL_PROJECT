import { useForm } from "react-hook-form";
import Modal from "../ui/Modal";
import { useToast } from "../../context/ToastContext";
import { createEnquiry } from "../../api/enquiries";
import { applyServerErrors } from "../../utils/apiErrors";

// Posts to POST /api/enquiries/ (PRD page 3).
export default function EnquiryModal({ open, onClose, property }) {
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { full_name: "", email: "", phone: "", message: "", visit_date: "" },
  });

  async function onSubmit(data) {
    try {
      await createEnquiry({
        property: property.id,
        ...data,
        // DRF's DateField rejects "" — omit entirely when left blank.
        visit_date: data.visit_date || null,
      });
      showToast("Enquiry sent! The host will get back to you soon.");
      reset();
      onClose();
    } catch (error) {
      applyServerErrors(error, { setError, showToast });
    }
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title={`Contact host about "${property.title}"`}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="full_name" className="text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="full_name"
            type="text"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register("full_name", { required: "Your name is required" })}
          />
          {errors.full_name && <p className="mt-1 text-xs text-error">{errors.full_name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
          />
          {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="080X XXX XXXX"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register("phone", { required: "Phone number is required" })}
          />
          {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="visit_date" className="text-sm font-medium text-slate-700">
            Preferred visit date (optional)
          </label>
          <input
            id="visit_date"
            type="date"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register("visit_date")}
          />
        </div>

        <div>
          <label htmlFor="message" className="text-sm font-medium text-slate-700">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            {...register("message", { required: "Add a short message for the host" })}
          />
          {errors.message && <p className="mt-1 text-xs text-error">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {isSubmitting ? "Sending…" : "Send Enquiry"}
        </button>
      </form>
    </Modal>
  );
}
