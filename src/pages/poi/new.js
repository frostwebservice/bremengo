import React from "react";
import { Helmet } from "react-helmet";
import { NavbarWithMegaMenu } from "../components/navbar";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  TrashIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Checkbox,
  Typography,
  Tooltip,
  Textarea,
  Spinner,
  Input,
} from "@material-tailwind/react";
import { FileInput } from "flowbite-react";
import DeuFlagImg from "../../images/flags/deuflage.png";
import AMFlagImg from "../../images/flags/amflag.png";
import { useState, useEffect, useRef } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  query,
  limit,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db, auth, storage } from "../../config/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
const NewPoiPage = () => {
  const navigate = useNavigate();
  const audioRefDe = useRef(null);
  const audioRefEn = useRef(null);
  const storyRefDe = useRef(null);
  const storyRefEn = useRef(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePanel, setImagePanel] = useState(Date.now());
  const [firstTextHeadingDe, setFirstTextHeadingDe] = useState("");
  const [firstTextHeadingEn, setFirstTextHeadingEn] = useState("");
  const [nameDe, setNameDe] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [addressDe, setAddressDe] = useState("");
  const [addressEn, setAddressEn] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descDe, setDescDe] = useState("");
  const [published, setPublished] = useState(false);

  const [linksDe, setLinksDe] = useState([]);
  const [linksEn, setLinksEn] = useState([]);
  const [firstTextHeadingDeError, setFirstTextHeadingDeError] = useState(false);
  const [firstTextHeadingEnError, setFirstTextHeadingEnError] = useState(false);
  const [nameDeError, setNameDeError] = useState(false);
  const [nameEnError, setNameEnError] = useState(false);
  const [descDeError, setDescDeError] = useState(false);
  const [descEnError, setDescEnError] = useState(false);

  const [tipDescDe, setTipDescDe] = useState("");
  const [tipDescEn, setTipDescEn] = useState("");
  const [tipLinkDe, setTipLinkDe] = useState("");
  const [tipLinkEn, setTipLinkEn] = useState("");

  const [willbeHidden, setWillbeHidden] = useState(false);
  const [isAR, setIsAR] = useState(false);
  const [isPanorama, setIsPanorama] = useState(false);
  const [GPS, setGPS] = useState("");
  const [GPSError, setGPSError] = useState(false);
  const [facebookDe, setFacebookDe] = useState("");
  const [facebookEn, setFacebookEn] = useState("");
  const [instagramDe, setInstagramDe] = useState("");
  const [instagramEn, setInstagramEn] = useState("");
  const [weblinkDe, setWeblinkDe] = useState("");
  const [weblinkEn, setWeblinkEn] = useState("");
  const [videoNameDe, setVideoNameDe] = useState("");
  const [videoNameEn, setVideoNameEn] = useState("");
  const [videoLinkDe, setVideoLinkDe] = useState("");
  const [videoLinkEn, setVideoLinkEn] = useState("");

  const [fileDe, setFileDe] = useState(null);
  const [fileEn, setFileEn] = useState(null);
  const [tipDe, setTipDe] = useState(null);
  const [tipEn, setTipEn] = useState(null);
  const [storyDe, setStoryDe] = useState(null);
  const [storyEn, setStoryEn] = useState(null);
  const [thumbDe, setThumbDe] = useState(null);

  const [audioSrcDe, setAudioSrcDe] = useState(null);
  const [audioSrcEn, setAudioSrcEn] = useState(null);
  const [storySrcDe, setStorySrcDe] = useState(null);
  const [storySrcEn, setStorySrcEn] = useState(null);

  const [thumbSrcDe, setThumbSrcDe] = useState(null);
  const [isModalOpenThumb, setIsModalOpenThumb] = useState(false);
  const [tipSrcDe, setTipSrcDe] = useState(null);
  const [isModalOpenTip, setIsModalOpenTip] = useState(false);

  const [arImageSrcDe, setARImageSrcDe] = useState(null);
  const [isModalOpenAR, setIsModalOpenAR] = useState(false);
  const [panoramaImageSrcDe, setPanoramaImageSrcDe] = useState(null);
  const [isModalOpenPanorama, setIsModalOpenPanorama] = useState(false);
  // const [thumbEn, setThumbEn] = useState(null);
  const [fileARImage, setFileARImage] = useState(null);
  const [filePanoramaImage, setFilePanoramaImage] = useState(null);

  const [images, setImages] = useState([]);

  const handleFileDeChange = (event) => {
    const selectedFile = event.target.files[0];
    setFileDe(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setAudioSrcDe(event.target.result); // Set audio source
        resetAudioDe();
      };

      reader.readAsDataURL(selectedFile); // Convert file to data URL
    }
  };
  const handleFileEnChange = (event) => {
    const selectedFile = event.target.files[0];
    setFileEn(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setAudioSrcEn(event.target.result); // Set audio source
        resetAudioEn();
      };

      reader.readAsDataURL(selectedFile); // Convert file to data URL
    }
  };
  const resetAudioDe = () => {
    if (audioRefDe.current) {
      audioRefDe.current.pause(); // Stop the old audio
      audioRefDe.current.load(); // Reload the new source
    }
  };
  const resetAudioEn = () => {
    if (audioRefEn.current) {
      audioRefEn.current.pause(); // Stop the old audio
      audioRefEn.current.load(); // Reload the new source
    }
  };
  const handleBilderChange = (index, event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update state only after the file is read
        setImages((prevImages) => {
          const newImages = [...prevImages];
          newImages[index].imageFile = selectedFile;
          newImages[index].previewUrl = reader.result;

          return newImages;
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  useEffect(() => {
    console.log();
  }, [images]);
  const removeImage = (index) => {
    const newImages = [...images]; // Create a copy of the state array
    newImages[index].isHidden = true;
    setImages(newImages);
  };
  const modalToggle = (index, isOpen) => {
    const newImages = [...images]; // Create a copy of the state array
    newImages[index].isModalOpen = isOpen;
    setImages(newImages);
  };
  const handleTipDeChange = (event) => {
    const selectedFile = event.target.files[0];
    setTipDe(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTipSrcDe(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const modalToggleTip = (isOpen) => {
    setIsModalOpenTip(isOpen);
  };
  const handleTipEnChange = (event) => {
    const selectedFile = event.target.files[0];
    setTipEn(selectedFile);
  };

  const handleThumbDeChange = (event) => {
    const selectedFile = event.target.files[0];
    setThumbDe(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbSrcDe(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const modalToggleThumb = (isOpen) => {
    setIsModalOpenThumb(isOpen);
  };
  // const handleThumbEnChange = (event) => {
  //   const selectedFile = event.target.files[0];
  //   setThumbEn(selectedFile);
  // };
  const handleAudioStoryDeChange = (event) => {
    const selectedFile = event.target.files[0];
    setStoryDe(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setStorySrcDe(event.target.result); // Set audio source
        resetStoryDe();
      };

      reader.readAsDataURL(selectedFile); // Convert file to data URL
    }
  };
  const handleAudioStoryEnChange = (event) => {
    const selectedFile = event.target.files[0];
    setStoryEn(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setStorySrcEn(event.target.result); // Set audio source
        resetStoryEn();
      };

      reader.readAsDataURL(selectedFile); // Convert file to data URL
    }
  };
  const resetStoryDe = () => {
    if (storyRefDe.current) {
      storyRefDe.current.pause(); // Stop the old audio
      storyRefDe.current.load(); // Reload the new source
    }
  };
  const resetStoryEn = () => {
    if (storyRefEn.current) {
      storyRefEn.current.pause(); // Stop the old story
      storyRefEn.current.load(); // Reload the new source
    }
  };
  const handleFileARImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setFileARImage(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setARImageSrcDe(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const handleFilePanoramaImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setFilePanoramaImage(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPanoramaImageSrcDe(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const modalToggleAR = (isOpen) => {
    setIsModalOpenAR(isOpen);
  };
  const modalTogglePanorama = (isOpen) => {
    setIsModalOpenPanorama(isOpen);
  };
  // Function to add a new item to the linksDe array
  const addNewImage = () => {
    setImages([
      ...images,
      {
        imageUrl: "",
        imageFile: null,
        imageDescriptionDe: "",
        imageDescriptionEn: "",
        previewUrl: null,
        isModalOpen: false,
        isHidden: false,
      },
    ]); // Add a new empty string to the array
  };
  const handleInputDeChange = (index, event) => {
    const newImages = [...images]; // Create a copy of the state array
    newImages[index].imageDescriptionDe = event.target.value; // Update the specific index with the new value
    setImages(newImages); // Update the state
  };
  const handleInputEnChange = (index, event) => {
    const newImages = [...images]; // Create a copy of the state array
    newImages[index].imageDescriptionEn = event.target.value; // Update the specific index with the new value
    setImages(newImages); // Update the state
  };

  const [fileDeUrl, setFileDeUrl] = useState("");
  const [fileEnUrl, setFileEnUrl] = useState("");

  const onSubmit = async () => {
    if (!firstTextHeadingDe) {
      setError(true);
      setFirstTextHeadingDeError(true);
      return;
    }
    if (!firstTextHeadingEn) {
      setError(true);
      setFirstTextHeadingEnError(true);
      return;
    }
    if (!nameDe) {
      setError(true);
      setNameDeError(true);
      return;
    }
    if (!nameEn) {
      setError(true);
      setNameEnError(true);
      return;
    }
    if (!descDe) {
      setDescDeError(true);
      setError(true);
      return;
    }
    if (!descEn) {
      setDescEnError(true);
      setError(true);
      return;
    }
    if (!GPS) {
      setGPSError(true);
      setError(true);
      return;
    }

    setLoading(true);

    const filteredImages = images.filter(
      (image) => image.imageFile !== null && image.isHidden == false
    );

    const uploadFile = async (file) => {
      if (file) {
        const timestamp = Date.now(); // Get the current timestamp
        const fileNameWithTimestamp = `${timestamp}_${file.name}`;
        const storageRef = ref(storage, fileNameWithTimestamp);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      }
      return null;
    };

    const imageUploadPromises = filteredImages.map(async (image) => {
      if (image.imageFile) {
        return uploadFile(image.imageFile).then((url) => {
          image.imageUrl = url; // Directly set the image URL
        });
      }
    });

    // Collect all other uploads
    const additionalUploads = [
      uploadFile(fileARImage),
      uploadFile(filePanoramaImage),
      uploadFile(storyDe),
      uploadFile(storyEn),
      uploadFile(fileDe),
      uploadFile(thumbDe),
      uploadFile(tipDe),
      uploadFile(fileEn),
    ];

    // Await all uploads
    await Promise.all([...imageUploadPromises, ...additionalUploads]);

    const imageUrls = filteredImages.map((image) => image.imageUrl);
    const imageDescriptionsDe = filteredImages.map(
      (image) => image.imageDescriptionDe
    );
    const imageDescriptionsEn = filteredImages.map(
      (image) => image.imageDescriptionEn
    );

    const poiData = {
      ARImage: await uploadFile(fileARImage),
      PanoramaImage: await uploadFile(filePanoramaImage),
      ThumbnailImage: await uploadFile(thumbDe),
      TipImage: await uploadFile(tipDe),
      arActive: isAR,
      arScenelsPanorama: isPanorama,
      gps: GPS,
      images: imageUrls,
      hideInOverview: willbeHidden,
      languages: {
        de: {
          FirstTextHeading: firstTextHeadingDe,
          POIAddress: addressDe,
          TipDescription: tipDescDe,
          TipLink: tipLinkDe,
          VideoName: videoNameDe,
          audiostory: await uploadFile(storyDe),
          firstAudio: await uploadFile(fileDe),
          firstText: descDe,
          imagesDescription: imageDescriptionsDe,
          name: nameDe,
          videoLink: videoLinkDe,
          facebookLink: facebookDe,
          instagramLink: instagramDe,
          weblink: weblinkDe,
        },
        en: {
          FirstTextHeading: firstTextHeadingEn,
          POIAddress: addressEn,
          TipDescription: tipDescEn,
          TipLink: tipLinkEn,
          VideoName: videoNameEn,
          audiostory: await uploadFile(storyEn),
          firstAudio: await uploadFile(fileEn),
          firstText: descEn,
          imagesDescription: imageDescriptionsEn,
          name: nameEn,
          videoLink: videoLinkEn,
          facebookLink: facebookEn,
          instagramLink: instagramEn,
          weblink: weblinkEn,
        },
      },
      published: published,
    };

    await addDoc(collection(db, "poi"), poiData);
    setLoading(false);
    navigate("/poi");
  };
  return (
    <>
      <Helmet>
        <title>Neuen POI erstellen | BremenGo</title>
        <meta name="description" content="BremenGo Home Screen" />
      </Helmet>
      <NavbarWithMegaMenu />
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <Spinner size="3xl" color="white" />
        </div>
      )}
      <div className="border-b-4 border-[#5A5A5A] mx-5">
        <div className="container m-auto mt-20 pb-12">
          <h1 className="text-[#5A5A5A] text-3xl font-medium">
            Neuen POI erstellen
          </h1>
        </div>
      </div>
      <div className="container m-auto mt-12">
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <div className="text-center m-auto mb-16">
              <img src={DeuFlagImg} className="m-auto" />
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip content="Max. 18 Zeichen" placement="top">
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Name
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={nameDe}
                      onChange={(e) => {
                        setNameDe(e.target.value);
                        setNameDeError(false);
                        setError(false);
                      }}
                    />
                    {nameDeError ? (
                      <p className="text-red-800">
                        Please fill out this field.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip
                  content="Unbegrenzte Anzahl an Zeichen"
                  placement="top"
                >
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Überschrift
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={firstTextHeadingDe}
                      onChange={(e) => {
                        setFirstTextHeadingDe(e.target.value);
                        setFirstTextHeadingDeError(false);
                        setError(false);
                      }}
                    />
                    {firstTextHeadingDeError ? (
                      <p className="text-red-800">
                        Please fill out this field.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip
                  content="Unbegrenzte Anzahl an Zeichen"
                  placement="top"
                >
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Adresse
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={addressDe}
                      onChange={(e) => {
                        setAddressDe(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip
                  content="Unbegrenzte Anzahl an Zeichen"
                  placement="top"
                >
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Text
                  </div>
                  <div className="col-span-9">
                    <Textarea
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={descDe}
                      onChange={(e) => {
                        setDescDeError(false);
                        setError(false);
                        setDescDe(e.target.value);
                      }}
                    />
                    {descDeError ? (
                      <p className="text-red-800">
                        Please fill out this field.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip
                  content="Vorlesetext für Barrierefreiheit, Audioformat: mp3, max. Dateigröße: 200kB"
                  placement="top"
                >
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Audio
                  </div>
                  <div className="col-span-9">
                    <FileInput
                      className="text-[#5A5A5A]"
                      accept="audio/*"
                      id="file-upload"
                      onChange={handleFileDeChange}
                    />
                    {audioSrcDe && (
                      <audio ref={audioRefDe} controls className="mt-2">
                        <source src={audioSrcDe} type="audio/mp3" />
                        Your browser does not support the audio tag.
                      </audio>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip
                  content="Audiostory, Audioformat: mp3, max. Dateigröße: 200kB"
                  placement="top"
                >
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    AudioStory
                  </div>
                  <div className="col-span-9">
                    <FileInput
                      className="text-[#5A5A5A]"
                      accept="audio/*"
                      id="file-upload"
                      onChange={handleAudioStoryDeChange}
                    />
                    {storySrcDe && (
                      <audio ref={storyRefDe} controls className="mt-2">
                        <source src={storySrcDe} type="audio/mp3" />
                        Your browser does not support the audio tag.
                      </audio>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip content="Video Name" placement="top">
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Video Überschrift
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={videoNameDe}
                      onChange={(e) => {
                        setVideoNameDe(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip content="Video Vorschaubild" placement="top">
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Video Vorschaubild
                  </div>
                  <div className="col-span-9">
                    <FileInput
                      className="text-[#5A5A5A]"
                      id="file-upload"
                      accept="image/*"
                      onChange={handleThumbDeChange}
                    />
                    {thumbSrcDe && (
                      <div className="relative mt-2 w-[max-content]">
                        {/* Thumbnail Preview */}
                        <img
                          src={thumbSrcDe}
                          alt="Preview"
                          className="w-72 h-auto rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
                          onClick={() => modalToggleThumb(true)} // Open modal on click
                        />

                        {/* Full-Size Modal */}
                        {isModalOpenThumb && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <img
                              src={thumbSrcDe}
                              alt="Full Size Preview"
                              className="max-w-full max-h-full rounded-lg shadow-xl"
                            />
                            <button
                              className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-md"
                              onClick={() => modalToggleThumb(false)} // Close modal on click
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip content="Vimeo Weblink" placement="top">
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Video Link
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={videoLinkDe}
                      onChange={(e) => {
                        setVideoLinkDe(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-center m-auto mb-16">
              <img src={AMFlagImg} className="m-auto" />
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1"></div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Name
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={nameEn}
                      onChange={(e) => {
                        setNameEnError(false);
                        setError(false);
                        setNameEn(e.target.value);
                      }}
                    />
                    {nameEnError ? (
                      <p className="text-red-800">
                        Please fill out this field.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1"></div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Überschrift
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={firstTextHeadingEn}
                      onChange={(e) => {
                        setFirstTextHeadingEnError(false);
                        setError(false);
                        setFirstTextHeadingEn(e.target.value);
                      }}
                    />
                    {firstTextHeadingEnError ? (
                      <p className="text-red-800">
                        Please fill out this field.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1"></div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Adresse
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={addressEn}
                      onChange={(e) => {
                        setAddressEn(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1"></div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Text
                  </div>
                  <div className="col-span-9">
                    <Textarea
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={descEn}
                      onChange={(e) => {
                        setDescEnError(false);
                        setError(false);
                        setDescEn(e.target.value);
                      }}
                    />
                    {descEnError ? (
                      <p className="text-red-800">
                        Please fill out this field.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1"></div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Audio
                  </div>
                  <div className="col-span-9">
                    <FileInput
                      className="text-[#5A5A5A]"
                      accept="audio/*"
                      id="file-upload"
                      onChange={handleFileEnChange}
                    />
                    {audioSrcEn && (
                      <audio ref={audioRefEn} controls className="mt-2">
                        <source src={audioSrcEn} type="audio/mp3" />
                        Your browser does not support the audio tag.
                      </audio>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1"></div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    AudioStory
                  </div>
                  <div className="col-span-9">
                    <FileInput
                      className="text-[#5A5A5A]"
                      accept="audio/*"
                      id="file-upload"
                      onChange={handleAudioStoryEnChange}
                    />
                    {storySrcEn && (
                      <audio ref={storyRefEn} controls className="mt-2">
                        <source src={storySrcEn} type="audio/mp3" />
                        Your browser does not support the audio tag.
                      </audio>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1"></div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Video Überschrift
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={videoNameEn}
                      onChange={(e) => {
                        setVideoNameEn(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1"></div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    {/* Video Vorschaubild */}
                    <br />
                    <br />
                  </div>
                  <div className="col-span-9">
                    {/* <FileInput
                      className="text-[#5A5A5A]"
                      id="file-upload"
                      onChange={handleThumbEnChange}
                    /> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1"></div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Video Link
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={videoLinkEn}
                      onChange={(e) => {
                        setVideoLinkEn(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b-4 border-[#5A5A5A] mx-5 mb-20">
        <div className="container m-auto mt-20 pb-12"></div>
      </div>
      <div className="container m-auto mt-12">
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h1 className="text-[#5A5A5A] text-3xl font-normal mb-12">
              Social Media Links
            </h1>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip content="Facebook-Link (ID Link)" placement="top">
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Facebook
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={facebookDe}
                      onChange={(e) => {
                        setFacebookDe(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip content="Instagram-Link (ID Link)" placement="top">
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Instagram
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={instagramDe}
                      onChange={(e) => {
                        setInstagramDe(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip content="Weblink (ID Link)" placement="top">
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Weblink
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={weblinkDe}
                      onChange={(e) => {
                        setWeblinkDe(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-[#5A5A5A] text-3xl font-normal mb-12">
              <br />
            </h1>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1"></div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Facebook
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={facebookEn}
                      onChange={(e) => {
                        setFacebookEn(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1"></div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Instagram
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={instagramEn}
                      onChange={(e) => {
                        setInstagramEn(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1"></div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Weblink
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={weblinkEn}
                      onChange={(e) => {
                        setWeblinkEn(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b-4 border-[#5A5A5A] mx-5 mb-20">
        <div className="container m-auto mt-20 pb-12"></div>
      </div>
      <div className="container m-auto mt-12">
        <h1 className="text-[#5A5A5A] text-3xl font-normal mb-12">Bilder</h1>
        <div className="grid grid-cols-12 gap-4 items-center mb-6">
          <div className="col-span-1">
            <Tooltip
              content="Format: Querformat, max. Dateigröße 200kB"
              placement="top"
            >
              <InformationCircleIcon
                strokeWidth={2}
                className="h-10 w-10 text-[#5A5A5A]"
              ></InformationCircleIcon>
            </Tooltip>
          </div>
          <div className="col-span-11"></div>
        </div>
        <div className="grid grid-cols-12 gap-4 items-center mb-6">
          <div className="col-span-1"></div>
          <div className="col-span-11">
            {images.map((image, index) => {
              return !image.isHidden ? (
                <div key={index}>
                  <div className="grid grid-cols-12 mb-6">
                    <div className="col-span-1 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                      Text
                    </div>
                    <div className="col-span-5">
                      <Input
                        className="bg-white"
                        icon={<PencilSquareIcon />}
                        value={image.imageDescriptionDe}
                        onChange={(e) => {
                          handleInputDeChange(index, e);
                        }}
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                      Text
                    </div>
                    <div className="col-span-5">
                      <Input
                        className="bg-white"
                        icon={<PencilSquareIcon />}
                        value={image.imageDescriptionEn}
                        onChange={(e) => {
                          handleInputEnChange(index, e);
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 mb-6">
                    <div className="col-span-1 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl"></div>
                    <div className="col-span-11">
                      <FileInput
                        className="text-[#5A5A5A]"
                        id="file-upload"
                        accept="image/*"
                        onChange={(e) => handleBilderChange(index, e)}
                      />
                      {image.previewUrl && (
                        <div className="relative mt-2 w-[max-content]">
                          {/* Thumbnail Preview */}
                          <img
                            src={image.previewUrl}
                            alt="Preview"
                            className="w-72 h-auto rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
                            onClick={() => modalToggle(index, true)} // Open modal on click
                          />

                          {/* Full-Size Modal */}
                          {image.isModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                              <img
                                src={image.previewUrl}
                                alt="Full Size Preview"
                                className="max-w-full max-h-full rounded-lg shadow-xl"
                              />
                              <button
                                className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-md"
                                onClick={() => modalToggle(index, false)} // Close modal on click
                              >
                                ✕
                              </button>
                            </div>
                          )}
                          <TrashIcon
                            strokeWidth={2}
                            className="h-6 w-6 text-[#5A5A5A]  cursor-pointer m-auto mt-2 transition"
                            onClick={() => removeImage(index)}
                          ></TrashIcon>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
        <div className="text-center mt-2">
          <div
            className="text-[#5A5A5A] text-xl text-center mt-2 inline-flex items-center"
            onClick={addNewImage}
          >
            Neues Bild hinzufügen
            <PlusCircleIcon strokeWidth={2} color="#5A5A5A" className="h-6 w-6">
              {" "}
            </PlusCircleIcon>
          </div>
        </div>
      </div>
      <div className="border-b-4 border-[#5A5A5A] mx-5 mb-20">
        <div className="container m-auto mt-20 pb-12"></div>
      </div>
      <div className="container m-auto mt-12">
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h1 className="text-[#5A5A5A] text-3xl font-normal mb-12">Tipp</h1>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip
                  content="Unbegrenzte Anzahl an Zeichen"
                  placement="top"
                >
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Beschreibung
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={tipDescDe}
                      onChange={(e) => {
                        setTipDescDe(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip content="Tip Link" placement="top">
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Link
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={tipLinkDe}
                      onChange={(e) => {
                        setTipLinkDe(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip
                  content="Format: Querformat, max. Dateigröße 200kB"
                  placement="top"
                >
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Bild
                  </div>
                  <div className="col-span-9">
                    <FileInput
                      className="text-[#5A5A5A]"
                      accept="image/*"
                      id="file-upload"
                      onChange={handleTipDeChange}
                    />
                    {tipSrcDe && (
                      <div className="relative mt-2 w-[max-content]">
                        {/* Thumbnail Preview */}
                        <img
                          src={tipSrcDe}
                          alt="Preview"
                          className="w-72 h-auto rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
                          onClick={() => modalToggleTip(true)} // Open modal on click
                        />

                        {/* Full-Size Modal */}
                        {isModalOpenTip && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <img
                              src={tipSrcDe}
                              alt="Full Size Preview"
                              className="max-w-full max-h-full rounded-lg shadow-xl"
                            />
                            <button
                              className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-md"
                              onClick={() => modalToggleTip(false)} // Close modal on click
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-[#5A5A5A] text-3xl font-normal mb-12">
              <br />
            </h1>

            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1"></div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Beschreibung
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={tipDescEn}
                      onChange={(e) => {
                        setTipDescEn(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1"></div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Link
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="bg-white"
                      icon={<PencilSquareIcon />}
                      value={tipLinkEn}
                      onChange={(e) => {
                        setTipLinkEn(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1"></div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    <br />
                  </div>
                  <div className="col-span-9">
                    {/* <FileInput
                      className="text-[#5A5A5A]"
                      id="file-upload"
                      onChange={handleTipEnChange}
                    /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b-4 border-[#5A5A5A] mx-5 mb-20">
        <div className="container m-auto mt-20 pb-12"></div>
      </div>
      <div className="container m-auto">
        <div className="grid gap-6">
          <div>
            <h1 className="text-[#5A5A5A] text-3xl font-normal mb-12">
              AR-Szene oder Panoramabild hinzufügen
            </h1>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip
                  content="Auswählen, wenn AR-Szene vorhanden"
                  placement="top"
                >
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-2 flex items-center justify-center pr-2 text-[#5A5A5A] text-xl"></div>
              <div className="col-span-9">
                <Checkbox
                  checked={isAR}
                  onChange={(e) => setIsAR(e.target.checked)}
                  label={
                    <Typography className="flex font-semibold text-[#5A5A5A]">
                      AR
                    </Typography>
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip
                  content="Auswählen, wenn die AR-Szene ein Panorama ist"
                  placement="top"
                >
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-2 flex items-center justify-center pr-2 text-[#5A5A5A] text-xl"></div>
              <div className="col-span-9">
                <Checkbox
                  checked={isPanorama}
                  onChange={(e) => setIsPanorama(e.target.checked)}
                  label={
                    <Typography className="flex font-semibold text-[#5A5A5A]">
                      Panorama
                    </Typography>
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip content="Zugewiesene Datei hochladen" placement="top">
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-2 flex items-center justify-center pr-2 text-[#5A5A5A] text-xl">
                AR Standort
              </div>
              <div className="col-span-9">
                <FileInput
                  className="text-[#5A5A5A]"
                  accept="image/*"
                  id="file-upload"
                  onChange={handleFileARImageChange}
                />
                {arImageSrcDe && (
                  <div className="relative mt-2 w-[max-content]">
                    {/* Thumbnail Preview */}
                    <img
                      src={arImageSrcDe}
                      alt="Preview"
                      className="w-72 h-auto rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
                      onClick={() => modalToggleAR(true)} // Open modal on click
                    />

                    {/* Full-Size Modal */}
                    {isModalOpenAR && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <img
                          src={arImageSrcDe}
                          alt="Full Size Preview"
                          className="max-w-full max-h-full rounded-lg shadow-xl"
                        />
                        <button
                          className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-md"
                          onClick={() => modalToggleAR(false)} // Close modal on click
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip content="Zugewiesene Datei hochladen" placement="top">
                  <InformationCircleIcon
                    strokeWidth={2}
                    className="h-10 w-10 text-[#5A5A5A]"
                  ></InformationCircleIcon>
                </Tooltip>
              </div>
              <div className="col-span-2 flex items-center justify-center pr-2 text-[#5A5A5A] text-xl">
                Panoramabild
              </div>
              <div className="col-span-9">
                <FileInput
                  className="text-[#5A5A5A]"
                  accept="image/*"
                  id="file-upload"
                  onChange={handleFilePanoramaImageChange}
                />
                {panoramaImageSrcDe && (
                  <div className="relative mt-2 w-[max-content]">
                    {/* Thumbnail Preview */}
                    <img
                      src={panoramaImageSrcDe}
                      alt="Preview"
                      className="w-72 h-auto rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
                      onClick={() => modalTogglePanorama(true)} // Open modal on click
                    />

                    {/* Full-Size Modal */}
                    {isModalOpenPanorama && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <img
                          src={panoramaImageSrcDe}
                          alt="Full Size Preview"
                          className="max-w-full max-h-full rounded-lg shadow-xl"
                        />
                        <button
                          className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-md"
                          onClick={() => modalTogglePanorama(false)} // Close modal on click
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b-4 border-[#5A5A5A] mx-5 mb-20">
        <div className="container m-auto mt-20 pb-12"></div>
      </div>
      <div className="container m-auto mb-40">
        <h1 className="text-[#5A5A5A] text-3xl font-normal mb-12">Weiteres</h1>
        <div className="grid grid-cols-12 gap-4 items-center mb-6">
          <div className="col-span-1">
            <Tooltip
              content="Soll der POI in der App in der Übersicht ausgeblendet werden?"
              placement="top"
            >
              <InformationCircleIcon
                strokeWidth={2}
                className="h-10 w-10 text-[#5A5A5A]"
              ></InformationCircleIcon>
            </Tooltip>
          </div>
          <div className="col-span-2"></div>
          <div className="col-span-9">
            <Checkbox
              checked={willbeHidden}
              onChange={(e) => setWillbeHidden(e.target.checked)}
              label={
                <Typography className="flex font-semibold text-[#5A5A5A]">
                  Ausblenden in POI Übersicht
                </Typography>
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 items-center mb-20">
          <div className="col-span-1">
            <Tooltip
              content="GPS-Koordinaten Schreibweise: Eingabe von Längen- und Breitengrad nach Google, mit Komma separiert (z.B. „53.5430895,8.5057031“)"
              placement="top"
            >
              <InformationCircleIcon
                strokeWidth={2}
                className="h-10 w-10 text-[#5A5A5A]"
              ></InformationCircleIcon>
            </Tooltip>
          </div>
          <div className="col-span-2 text-[#5A5A5A] text-xl">GPS</div>
          <div className="col-span-9">
            <Input
              className="bg-white"
              icon={<PencilSquareIcon />}
              value={GPS}
              onChange={(e) => {
                setGPS(e.target.value);
                setGPSError(false);
                setError(false);
              }}
            />
            {GPSError ? (
              <p className="text-red-800">Please fill out this field.</p>
            ) : null}
          </div>
        </div>
        <div className="grid lg:grid-cols-6">
          <div className="col-span-4">
            <Checkbox
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              label={
                <Typography className="flex font-semibold text-[#5A5A5A]">
                  Veröffentlichen
                </Typography>
              }
            />
          </div>
          <div>
            <Link to="/poi">
              <Button
                variant="outlined"
                className="text-[#5A5A5A] px-10 bg-white border-none"
              >
                Abbrechen
              </Button>
            </Link>
          </div>
          <div>
            <Button
              variant="outlined"
              className="text-[#5A5A5A] px-10 bg-white border-none hover:text-red-800"
              onClick={onSubmit}
            >
              Speichern
            </Button>
            {error ? (
              <div className="text-red-800 mt-2">
                Bitte fülle alle Pflichtfelder aus.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPoiPage;
