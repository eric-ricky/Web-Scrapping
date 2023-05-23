import { FieldInputProps, FormikErrors, FormikTouched } from 'formik';
import React from 'react';

interface ISellerInfo {
  errors: FormikErrors<{
    email: string;
    phone: string;
  }>;
  touched: FormikTouched<{
    email: string;
    phone: string;
  }>;
  // eslint-disable-next-line no-unused-vars
  getFieldProps: (nameOrOptions: any) => FieldInputProps<any>;
}

const SellerInfo: React.FC<ISellerInfo> = ({
  errors,
  getFieldProps,
  touched,
}) => {
  return (
    <div className="grid grid-cols-6 gap-6 py-4 px-6">
      <div className="col-span-6">
        <p className="">Personal Information:</p>
      </div>

      {/* email */}
      <div className="col-span-6 sm:col-span-3">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          {...getFieldProps('email')}
          type="email"
          name="email"
          id="email"
          className="mt-1 p-2 w-full rounded-md border shadow-sm"
        />
        <p className="text-sm text-red-500 text-left mt-1 pl-1 outline-slate-400">
          {touched.email && `${errors.email ? errors.email : ''}`}
        </p>
      </div>

      {/* phone */}
      <div className="col-span-6 sm:col-span-3">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          {...getFieldProps('phone')}
          type="tel"
          name="phone"
          id="phone"
          className="mt-1 p-2 w-full rounded-md border shadow-sm"
        />
        <p className="text-sm text-red-500 text-left mt-1 pl-1 outline-slate-400">
          {touched.phone && `${errors.phone ? errors.phone : ''}`}
        </p>
      </div>
    </div>
  );
};

export default SellerInfo;
