import { FieldInputProps, FormikErrors, FormikTouched } from 'formik';
import dynamic from 'next/dynamic';
import React, { Dispatch, SetStateAction } from 'react';
import { IShot } from '..';
import SellerInfo from './seller-info';

const ListingDetails = dynamic(() => import('./listing-details'));

interface IListing {
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

const Listing: React.FC<IListing> = ({
  errors,
  getFieldProps,
  touched,
  screenshots,
  setScreenShots,
}) => {
  return (
    <div className="bg-brandwhite rounded-md shadow-sm">
      {/* operator Info*/}
      <SellerInfo
        errors={errors}
        getFieldProps={getFieldProps}
        touched={touched}
      />

      {/* line------- */}
      <div className="col-span-6 py-5">
        <div className="border-t border-gray-200"></div>
      </div>
      {/* end of line----- */}

      {/* listing details */}
      <ListingDetails
        errors={errors}
        getFieldProps={getFieldProps}
        touched={touched}
        screenshots={screenshots}
        setScreenShots={setScreenShots}
      />
    </div>
  );
};

export default Listing;
