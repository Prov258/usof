import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { User, Settings, Lock } from "lucide-react";
import { updateProfile, changePassword } from "../store/slices/authSlice";
import type { RootState } from "../store";

interface ProfileForm {
  fullName: string;
  email: string;
  avatar: string;
}

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileForm>({
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch: watchPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordForm>();

  const onProfileSubmit = async (data: ProfileForm) => {
    try {
      await dispatch(updateProfile(data)).unwrap();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      await dispatch(
        changePassword({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        })
      ).unwrap();
      toast.success("Password changed successfully!");
      resetPassword();
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Please log in to view your profile
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Settings</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === "security"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Security</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "profile" ? (
            <form
              onSubmit={handleProfileSubmit(onProfileSubmit)}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  {...registerProfile("fullName", {
                    required: "Full name is required",
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {profileErrors.fullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {profileErrors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...registerProfile("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {profileErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {profileErrors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  id="avatar"
                  {...registerProfile("avatar")}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {profileErrors.avatar && (
                  <p className="mt-1 text-sm text-red-600">
                    {profileErrors.avatar.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  {...registerPassword("oldPassword", {
                    required: "Current password is required",
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {passwordErrors.oldPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordErrors.oldPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  {...registerPassword("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  {...registerPassword("confirmPassword", {
                    required: "Please confirm your new password",
                    validate: (value) =>
                      value === watchPassword("newPassword") ||
                      "Passwords do not match",
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? "Changing Password..." : "Change Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
