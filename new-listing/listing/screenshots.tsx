import { CloudDownloadIcon, XCircleIcon } from '@heroicons/react/outline';
import { StorageReference } from 'firebase/storage';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { IShot } from '..';
import { getFirebaseClient } from '../../../../../lib/firebase/config';
import { IAlert } from '../../../../../types';

import Spinner from '../../../../ui/spinner';

const AlertComponent = dynamic(() => import('../../../../ui/alert'));

interface IScreenShots {
  screenshots: [] | IShot[];
  setScreenShots: Dispatch<SetStateAction<[] | IShot[]>>;
}

const ScreenShots: React.FC<IScreenShots> = ({
  screenshots,
  setScreenShots,
}) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(50);
  const [isDeleting, setIsDeleting] = useState(false);

  const [fileUploadError, setFileUploadError] = useState<IAlert | undefined>(
    undefined
  );

  const FILE_SIZE = 4194304; // (4mb * 1024 *1024 )bytes
  const SUPPORTED_FORMATS = ['image/png', 'image/jpeg'];

  const handleDeletePhoto = async (storageRef: StorageReference) => {
    setIsDeleting(true);

    const firebaseClient = await getFirebaseClient();
    const { deleteObject } = firebaseClient;

    deleteObject(storageRef)
      .then(() => {
        // File deleted successfully
        console.log('file deleted successfully');
        setScreenShots((prev) =>
          prev.filter((shot) => shot.ref !== storageRef)
        );
        setIsDeleting(false);
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log('something went wrong!', error);
        setIsDeleting(false);
      });
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setFileUploadError(undefined);
    setLoading(true);
    setProgress(0);

    const imgFile = e.target.files[0];

    if (!SUPPORTED_FORMATS.includes(imgFile.type)) {
      setLoading(false);
      setFileUploadError({
        message: 'Unsupported File Format',
        severity: 'error',
      });
      return;
    }

    if (imgFile.size > FILE_SIZE) {
      setLoading(false);
      setFileUploadError({
        message: 'File Size is too large',
        severity: 'error',
      });
      return;
    }

    try {
      // importing firebase
      const firebaseClient = await getFirebaseClient();
      const { storage, getDownloadURL, ref, uploadBytesResumable } =
        firebaseClient;

      console.log('uploading....');

      const fileRef = ref(
        storage,
        `Images/Listings/Screenshots/${Date.now()}-${imgFile.name}`
      );

      const uploadTask = uploadBytesResumable(fileRef, imgFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const uploadProgress = Math.floor(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(uploadProgress);
        },
        (err) => {
          console.log(err);
          setLoading(false);
          setFileUploadError({
            message: 'Something went wrong',
            severity: 'error',
          });
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (url) => {
              console.log(url);
              const imgUrl = url ? `${url}` : '';

              setScreenShots((prev) => [
                ...prev,
                { ref: fileRef, url: imgUrl },
              ]);

              setProgress(0);
              setLoading(false);
            })
            .catch((err) => console.log(err));
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="col-span-6">
      <label className="block text-sm font-medium text-gray-700">
        Screenshots
      </label>
      <div className="mt-1 flex itens-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
        <div className="w-full flex flex-col space-y-4">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {screenshots.length > 0 &&
              screenshots.map((shot, i) => (
                <div key={i}>
                  <div className="relative h-36 w-24 md:h-44 md:w-36">
                    <Image
                      src={`${shot.url}`}
                      alt="uploaded screenshot"
                      layout="fill"
                      objectFit="cover"
                      className="bg-[rgba(0,0,0,0.5)]"
                    />

                    <XCircleIcon
                      onClick={() => shot.ref && handleDeletePhoto(shot.ref)}
                      className="absolute top-0 right-0 z-20 h-8 text-red-500 bg-white shadow-lg cursor-pointer"
                    />

                    {isDeleting && (
                      <div className="absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.65)] grid place-items-center">
                        <div className="flex flex-col space-y-2">
                          <Spinner color="white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {loading ? (
            <div className="relative bg-slate-200 rounded-md shadow-md w-full mt-6">
              <p className="text-center">Uploading {progress}%</p>
              <span
                style={{
                  width: `${progress}%`,
                }}
                className={`absolute bottom-0 left-0 h-full bg-[#b87114bf]`}
              />
            </div>
          ) : (
            screenshots.length < 4 && (
              <div className="space-y-1 text-center">
                <CloudDownloadIcon className="h-10 text-gray-500 mx-auto" />
                <div className="flex flex-col items-center text-sm text-gray-600 text-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload screenshots</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  JPEG, PNG up to 4 screenshots
                </p>

                {fileUploadError && (
                  <AlertComponent alertObject={fileUploadError} />
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenShots;
