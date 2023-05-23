import { FieldInputProps, FormikErrors, FormikTouched } from 'formik';
import { Dispatch, SetStateAction } from 'react';
import { IShot } from '..';
import ScreenShots from './screenshots';

interface IListingDetails {
  errors: FormikErrors<{
    email: string;
    phone: string;
    title: string;
    description: string;
    price: string;
    currency: string;
    category: string;
    rating: string;
  }>;
  touched: FormikTouched<{
    email: string;
    phone: string;
    title: string;
    description: string;
    price: string;
    currency: string;
    category: string;
    rating: string;
  }>;
  // eslint-disable-next-line no-unused-vars
  getFieldProps: (nameOrOptions: any) => FieldInputProps<any>;
  screenshots: [] | IShot[];
  setScreenShots: Dispatch<SetStateAction<[] | IShot[]>>;
}

const ListingDetails: React.FC<IListingDetails> = ({
  errors,
  getFieldProps,
  touched,
  screenshots,
  setScreenShots,
}) => {
  return (
    <div className="relative grid grid-cols-6 gap-6 pb-10 px-6">
      <div className="col-span-6">
        <p className="">Listing Details:</p>
      </div>

      {/* title */}
      <div className="col-span-6">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          {...getFieldProps('title')}
          type="text"
          name="title"
          id="title"
          className="mt-1 p-2 w-full rounded-md border shadow-sm"
        />
        <p className="text-sm text-red-500 text-left mt-1 pl-1 outline-slate-400">
          {touched.title && `${errors.title ? errors.title : ''}`}
        </p>
      </div>

      {/* description */}
      <div className="col-span-6">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          {...getFieldProps('description')}
          name="description"
          id="description"
          cols={30}
          rows={5}
          className="mt-1 p-2 w-full rounded-md border shadow-sm"
        />
        <p className="text-sm text-red-500 text-left mt-1 pl-1 outline-slate-400">
          {touched.description &&
            `${errors.description ? errors.description : ''}`}
        </p>
      </div>

      {/* category */}
      <div className="col-span-6 sm:col-span-3">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Select category
        </label>

        <select
          {...getFieldProps('category')}
          name="category"
          id="category"
          aria-label="Default select example"
          className="mt-1 p-2 w-full rounded-md border shadow-sm"
        >
          <option value="transcription">Trascription</option>
          <option value="academic">Academic</option>
          <option value="article">Article</option>
          <option value="other">Other</option>
        </select>

        <p className="text-sm text-red-500 text-left mt-1 pl-1 outline-slate-400">
          {touched.category && `${errors.category ? errors.category : ''}`}
        </p>
      </div>

      {/* acount rating */}
      <div className="col-span-6 sm:col-span-3">
        <label
          htmlFor="rating"
          className="block text-sm font-medium text-gray-700"
        >
          Account rating <span className="text-gray-500">(e.g 4.5/5)</span>
        </label>
        <input
          {...getFieldProps('rating')}
          type="text"
          name="rating"
          id="rating"
          className="mt-1 p-2 w-full rounded-md border shadow-sm"
        />
        <p className="text-sm text-red-500 text-left mt-1 pl-1 outline-slate-400">
          {touched.rating && `${errors.rating ? errors.rating : ''}`}
        </p>
      </div>

      {/* Currency */}
      <div className="col-span-6 sm:col-span-3">
        <label
          htmlFor="currency"
          className="block text-sm font-medium text-gray-700"
        >
          Currency
        </label>

        <select
          {...getFieldProps('currency')}
          name="currency"
          id="currency"
          aria-label="Default select example"
          className="mt-1 p-2 w-full rounded-md border shadow-sm"
        >
          <option value="KES">KES</option>
          <option value="USD">USD</option>
        </select>
        <p className="text-sm text-red-500 text-left mt-1 pl-1 outline-slate-400">
          {touched.currency && `${errors.currency ? errors.currency : ''}`}
        </p>
      </div>

      {/* Price */}
      <div className="col-span-6 sm:col-span-3">
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          {...getFieldProps('price')}
          type="text"
          name="price"
          id="price"
          className="mt-1 p-2 w-full rounded-md border shadow-sm"
        />
        <p className="text-sm text-red-500 text-left mt-1 pl-1 outline-slate-400">
          {touched.price && `${errors.price ? errors.price : ''}`}
        </p>
      </div>

      {/* screenshots */}
      <ScreenShots screenshots={screenshots} setScreenShots={setScreenShots} />
    </div>
  );
};

export default ListingDetails;
