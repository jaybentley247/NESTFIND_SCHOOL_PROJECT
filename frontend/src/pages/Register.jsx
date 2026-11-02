import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UserRound, Building2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import { applyServerErrors } from "../utils/apiErrors";

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export default function Register() {
  const { register: doRegister } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [avatarPreview, setAvatarPreview] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { full_name: "", email: "", password: "", confirm_password: "", role: "tenant" },
  });

  const selectedRole = watch("role");

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  }

  async function onSubmit(data) {
    try {
      const user = await doRegister(data);
      showToast(`Welcome to NestFind, ${user.full_name.split(" ")[0]}!`);
      navigate(location.state?.from?.pathname || (user.role === "host" ? "/dashboard" : "/"), { replace: true });
    } catch (error) {
      applyServerErrors(error, { setError, showToast });
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
      <p className="mt-1 text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" state={location.state} className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        <div>
          <label htmlFor="full_name" className="text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="full_name"
            type="text"
            className={inputClass}
            {...register("full_name", { required: "Your full name is required" })}
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
            className={inputClass}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
          />
          {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={inputClass}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
            })}
          />
          {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirm_password" className="text-sm font-medium text-slate-700">
            Confirm password
          </label>
          <input
            id="confirm_password"
            type="password"
            className={inputClass}
            {...register("confirm_password", {
              required: "Please confirm your password",
              validate: (value, formValues) => value === formValues.password || "Passwords do not match",
            })}
          />
          {errors.confirm_password && <p className="mt-1 text-xs text-error">{errors.confirm_password.message}</p>}
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-slate-700">I want to…</legend>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <label
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                selectedRole === "tenant" ? "border-primary bg-primary-50 text-primary-700" : "border-slate-200 text-slate-600"
              }`}
            >
              <input type="radio" value="tenant" className="sr-only" {...register("role")} />
              <UserRound className="h-4 w-4" aria-hidden="true" />
              Find a home
            </label>
            <label
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                selectedRole === "host" ? "border-primary bg-primary-50 text-primary-700" : "border-slate-200 text-slate-600"
              }`}
            >
              <input type="radio" value="host" className="sr-only" {...register("role")} />
              <Building2 className="h-4 w-4" aria-hidden="true" />
              List properties
            </label>
          </div>
        </fieldset>

        <div>
          <label htmlFor="avatar" className="text-sm font-medium text-slate-700">
            Profile photo (optional)
          </label>
          <div className="mt-1 flex items-center gap-3">
            {avatarPreview && (
              <img src={avatarPreview} alt="" loading="lazy" className="h-10 w-10 rounded-full object-cover" />
            )}
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  );
}
