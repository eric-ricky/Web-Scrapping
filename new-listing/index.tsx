import { PlusIcon } from '@heroicons/react/outline';
import { StorageReference } from 'firebase/storage';
import { Form, FormikProvider, useFormik } from 'formik';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useState } from 'react';
import * as Yup from 'yup';
import { useAuthContext } from '../../../../lib/context/auth-context';
import { getFirebaseClient } from '../../../../lib/firebase/config';
import { IAlert } from '../../../../types';
import Spinner from '../../../ui/spinner';

import Listing from './listing';

const AlertComponent = dynamic(() => import('../../../ui/alert'));

export interface IShot {
  ref: StorageReference | undefined;
  url: string;
}

const NewListingForm = () => {
  const [showListing, setShowListing] = useState(false);
  const [screenshots, setScreenShots] = useState<IShot[] | []>([]);
  const [formAlert, setFormAlert] = useState<IAlert | undefined>(undefined);

  const userCtx = useAuthContext();
  const router = useRouter();

  const facilitySchema = Yup.object().shape({
    email: Yup.string()
      .email('Provide a valid email')
      .required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.string().required('Price is required'),
    currency: Yup.string().required('Specify the currency'),
    category: Yup.string().required('Specify the category'),
    rating: Yup.string().required('Specify the account rating'),
  });

  const formik = useFormik({
    initialValues: {
      email: userCtx?.user.email || '',
      phone: userCtx?.user.phone || '',
      title: '',
      description: '',
      price: '',
      currency: 'KES',
      category: 'transcription',
      rating: '',
    },
    validationSchema: facilitySchema,
    onSubmit: async (values) => {
      const images = screenshots.map((shot) => shot.url);
      const {
        category,
        currency,
        description,
        email,
        phone,
        price,
        rating,
        title,
      } = values;

      const payload = {
        sellerId: userCtx?.user.uid,
        sellerInfo: {
          phone: userCtx?.user.phone || phone,
          email: userCtx?.user.email || email,
        },
        category,
        currency,
        description,
        price,
        rating,
        title,
        screenshots: images,
        impressions: 0,
      };
      console.log(payload);

      try {
        // importing firebase
        const FirebaseClient = await getFirebaseClient();
        const { db, doc, collection, getDoc, addDoc } = FirebaseClient;

        const colRef = collection(db, 'listings');
        await addDoc(colRef, payload);

        setFormAlert({
          severity: 'success',
          message: 'Listing created successfully',
        });

        setScreenShots([]);
      } catch (error) {
        console.log(error);
        setFormAlert({ message: 'Something went wrong', severity: 'error' });
      }
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <div className="relative bg-white shadow-xl rounded-md">
          {isSubmitting && (
            <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] z-50 text-white rounded-md grid place-items-center">
              <div>
                <Spinner color="white" />
                <p className="headingxs mt-8">Submitting...</p>
              </div>
            </div>
          )}

          <div className="px-2 py-5 sm:p-8">
            {showListing ? (
              <Listing
                errors={errors}
                getFieldProps={getFieldProps}
                touched={touched}
                screenshots={screenshots}
                setScreenShots={setScreenShots}
              />
            ) : (
              <div
                className="mt-1 flex items-center justify-between rounded-md border-2 border-dashed border-gray-300 px-6 py-2 cursor-pointer"
                onClick={() => setShowListing(true)}
              >
                <div className="font-bold">Create Listing</div>
                <PlusIcon className="h-6 text-black" />
              </div>
            )}
          </div>

          <div className=" bg-gray-50 px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="grid place-items-center">
                {formAlert && <AlertComponent alertObject={formAlert} />}
              </div>
              <button
                type="submit"
                disabled={!showListing}
                className={`${
                  showListing
                    ? 'opacity-100 cursor-pointer hover:bg-orange-700'
                    : 'opacity-50 cursor-not-allowed'
                } rounded-md border border-transparent bg-brandorange py-2 px-4 text-md font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 `}
              >
                {isSubmitting ? 'Submiting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </Form>
    </FormikProvider>
  );
};

export default NewListingForm;
