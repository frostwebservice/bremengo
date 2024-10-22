import React from "react";
import { Helmet } from "react-helmet";
import { NavbarWithMegaMenu } from "../components/navbar";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
  updateDoc,
  query,
  limit,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db, auth, storage } from "../../config/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDrag, useDrop } from "react-dnd";
const ItemTypes = {
  CARD: "card",
};
const EditPoiPage = () => {
  const [error, setError] = useState(false);
  const moveItem = (dragIndex, hoverIndex) => {
    const draggedItem = oldImages[dragIndex];
    const newSortedItems = [...oldImages];
    newSortedItems.splice(dragIndex, 1);
    newSortedItems.splice(hoverIndex, 0, draggedItem);
    setOldImages(newSortedItems);
  };
  const Item = ({ item, index }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.CARD,
      item: { type: ItemTypes.CARD, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: ItemTypes.CARD,
      hover: (item) => {
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) {
          return;
        }

        moveItem(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    const opacity = isDragging ? 0.5 : 1;

    return (
      <div
        ref={(node) => drag(drop(node))}
        className={`col-span-3 ${isDragging ? "opacity-50" : ""}`}
        style={{ cursor: "move" }}
      >
        <div>
          <img
            src={item.imageUrl}
            alt=""
            className="cursor-pointer"
            onClick={() => modalToggleOld(index, true)}
          />
        </div>
        {item.isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <img
              src={item.imageUrl}
              alt="Full Size Preview"
              className="max-w-full max-h-full rounded-lg shadow-xl"
            />
            <button
              className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-md"
              onClick={() => modalToggleOld(index, false)}
            >
              ✕
            </button>
          </div>
        )}
        <div className="grid grid-cols-12 gap-1 mt-1">
          <div className="flex">
            <img src={DeuFlagImg} alt="" />
          </div>
          <div className="col-span-11">
            <Input
              className="bg-white"
              icon={<PencilSquareIcon />}
              value={item.imageDescriptionDe}
              onChange={(e) => handleOldImageDeChange(index, e)}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-1 mt-1">
          <div className="flex">
            <img src={AMFlagImg} alt="" />
          </div>
          <div className="col-span-11">
            <Input
              className="bg-white"
              icon={<PencilSquareIcon />}
              value={item.imageDescriptionEn}
              onChange={(e) => handleOldImageEnChange(index, e)}
            />
          </div>
        </div>
        <div className="mt-1"></div>
        <TrashIcon
          strokeWidth={2}
          className="h-6 w-6 text-[#5A5A5A]  cursor-pointer m-auto mt-1"
          onClick={(e) => {
            removeOldImage(index);
          }}
        ></TrashIcon>
      </div>
    );
  };
  const navigate = useNavigate();
  const audioRefDe = useRef(null);
  const audioRefEn = useRef(null);
  const storyRefDe = useRef(null);
  const storyRefEn = useRef(null);
  const [loading, setLoading] = useState(false);
  const [poiID, setPoiID] = useState("");

  const [firstTextHeadingDe, setFirstTextHeadingDe] = useState("");
  const [firstTextHeadingEn, setFirstTextHeadingEn] = useState("");
  const [nameDe, setNameDe] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [addressDe, setAddressDe] = useState("");
  const [addressEn, setAddressEn] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descDe, setDescDe] = useState("");
  const [published, setPublished] = useState(false);

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
  const [oldImages, setOldImages] = useState([]);
  const [fileDeUrl, setFileDeUrl] = useState("");
  const [isFileDe, setIsFileDe] = useState(false);
  const [fileEnUrl, setFileEnUrl] = useState("");
  const [isFileEn, setIsFileEn] = useState(false);
  const [tipDeUrl, setTipDeUrl] = useState("");
  const [isTipDe, setIsTipDe] = useState(false);
  const [storyDeUrl, setStoryDeUrl] = useState("");
  const [isStoryDe, setIsStoryDe] = useState(false);
  const [storyEnUrl, setStoryEnUrl] = useState("");
  const [isStoryEn, setIsStoryEn] = useState(false);
  const [thumbDeUrl, setThumbDeUrl] = useState("");
  const [isThumbDe, setIsThumbDe] = useState(false);
  const [fileARImageUrl, setFileARImageUrl] = useState("");
  const [isFileARImage, setIsFileARImage] = useState(false);
  const [filePanoramaImageUrl, setFilePanoramaImageUrl] = useState("");
  const [isFilePanoramaImage, setIsFilePanoramaImage] = useState(false);

  const [isModalOpenDeBasic, setIsModalOpenDeBasic] = useState(false);
  const [isModalOpenEnBasic, setIsModalOpenEnBasic] = useState(false);
  const [isModalOpenThumbBasic, setIsModalOpenThumbBasic] = useState(false);
  const [isModalOpenTipDeBasic, setIsModalOpenTipDeBasic] = useState(false);
  const [isModalOpenARBasic, setIsModalOpenARBasic] = useState(false);
  const [isModalOpenPanoramaBasic, setIsModalPanoramaBasic] = useState(false);
  const modalToggleARBasic = (isOpen) => {
    setIsModalOpenARBasic(isOpen);
  };
  const modalTogglePanoramaBasic = (isOpen) => {
    setIsModalPanoramaBasic(isOpen);
  };
  const modalToggleDeBasic = (isOpen) => {
    setIsModalOpenDeBasic(isOpen);
  };
  const modalToggleEnBasic = (isOpen) => {
    setIsModalOpenEnBasic(isOpen);
  };
  const modalToggleThumbBasic = (isOpen) => {
    setIsModalOpenThumbBasic(isOpen);
  };
  const modalToggleTipDeBasic = (isOpen) => {
    setIsModalOpenTipDeBasic(isOpen);
  };

  const extractFileName = (url) => {
    const path = url.split("?")[0]; // Removes query parameters
    const fileName = path.substring(path.lastIndexOf("/") + 1);
    return decodeURIComponent(fileName); // Decodes the URL-encoded characters
  };
  useEffect(() => {
    async function fetchData() {
      const path = window.location.pathname;
      const id = path.split("/").pop(); // Assuming faq_id is at the end of the URL
      setPoiID(id);
      const docRef = doc(db, "poi", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data(); // Extracts the data
        console.log(data);

        setFileDeUrl(data.languages.de.firstAudio);
        setFileEnUrl(data.languages.en.firstAudio);
        setTipDeUrl(data.TipImage);
        setStoryDeUrl(data.languages.de.audiostory);
        setStoryEnUrl(data.languages.en.audiostory);
        setThumbDeUrl(data.ThumbnailImage);
        setFilePanoramaImageUrl(data.PanoramaImage);
        setFirstTextHeadingDe(data.languages.de.FirstTextHeading);
        setFirstTextHeadingEn(data.languages.en.FirstTextHeading);
        setNameDe(data.languages.de.name);
        setNameEn(data.languages.en.name);
        setAddressDe(data.languages.de.POIAddress);
        setAddressEn(data.languages.en.POIAddress);
        setDescDe(data.languages.de.firstText);
        setDescEn(data.languages.en.firstText);
        setPublished(data.published);
        setTipDescDe(data.languages.de.TipDescription);
        setTipDescEn(data.languages.en.TipDescription);
        setTipLinkDe(data.languages.de.TipLink);
        setTipLinkEn(data.languages.en.TipLink);
        setWillbeHidden(data.hideInOverview);
        setIsAR(data.arActive);
        setIsPanorama(data.arScenelsPanorama);
        setGPS(data.gps);
        setFacebookDe(data.languages.de.facebookLink);
        setFacebookEn(data.languages.en.facebookLink);
        setInstagramDe(data.languages.de.instagramLink);
        setInstagramEn(data.languages.en.instagramLink);
        setWeblinkDe(data.languages.de.weblink);
        setWeblinkEn(data.languages.en.weblink);
        setVideoNameDe(data.languages.de.VideoName);
        setVideoNameEn(data.languages.en.VideoName);
        setVideoLinkDe(data.languages.de.videoLink);
        setVideoLinkEn(data.languages.en.videoLink);
        setFileARImageUrl(data.ARImage);
        if (data.ARImage) {
          setIsFileARImage(true);
        }
        if (data.PanoramaImage) {
          setIsFilePanoramaImage(true);
        }
        if (data.ThumbnailImage) {
          setIsThumbDe(true);
        }
        if (data.TipImage) {
          setIsTipDe(true);
        }
        if (data.languages.de.audiostory) {
          setIsStoryDe(true);
        }
        if (data.languages.en.audiostory) {
          setIsStoryEn(true);
        }
        if (data.languages.de.firstAudio) {
          setIsFileDe(true);
        }
        if (data.languages.en.firstAudio) {
          setIsFileEn(true);
        }

        const backend_images = data.images.map((image, index) => ({
          imageUrl: image,
          imageFile: null,
          imageDescriptionDe: data.languages.de.imagesDescription[index],
          imageDescriptionEn: data.languages.en.imagesDescription[index],
          isModalOpen: false,
        }));
        setOldImages(backend_images);
      } else {
        console.log("No such document!");
      }
    }
    fetchData();
  }, []);

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
  const modalToggleOld = (index, isOpen) => {
    const newImages = [...oldImages]; // Create a copy of the state array
    newImages[index].isModalOpen = isOpen;
    setOldImages(newImages);
  };
  const handleOldImageDeChange = (index, event) => {
    const newDescription = event.target.value; // Get the new description from the event
    setOldImages((prevImages) => {
      // Create a new copy of the images array
      const updatedImages = [...prevImages];
      // Update the imageDescriptionDe for the specific index
      updatedImages[index] = {
        ...updatedImages[index],
        imageDescriptionDe: newDescription,
      };
      return updatedImages; // Return the updated array
    });
  };
  const handleOldImageEnChange = (index, event) => {
    const newDescription = event.target.value; // Get the new description from the event
    setOldImages((prevImages) => {
      // Create a new copy of the images array
      const updatedImages = [...prevImages];
      // Update the imageDescriptionDe for the specific index
      updatedImages[index] = {
        ...updatedImages[index],
        imageDescriptionEn: newDescription,
      };
      return updatedImages; // Return the updated array
    });
  };
  const removeOldImage = (index) => {
    setOldImages((prevImages) => prevImages.filter((_, i) => i !== index));
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

  const onSubmit = async () => {
    if (firstTextHeadingDe === "") {
      setError(true);
      setFirstTextHeadingDeError(true);
      return;
    } else if (firstTextHeadingEn === "") {
      setError(true);
      setFirstTextHeadingEnError(true);
      return;
    } else if (nameDe === "") {
      setError(true);
      setNameDeError(true);
      return;
    } else if (nameEn === "") {
      setError(true);
      setNameEnError(true);
      return;
    } else if (descDe === "") {
      setError(true);
      setDescDeError(true);
      return;
    } else if (descEn === "") {
      setError(true);
      setDescEnError(true);
      return;
    } else if (GPS === "") {
      setGPSError(true);
      setError(true);
      return;
    }

    setLoading(true);

    const filteredImages = images.filter(
      (image) => image.imageFile !== null && image.isHidden == false
    );

    const uploadFile = async (file) => {
      if (!file) return null;
      const timestamp = Date.now(); // Get the current timestamp
      const fileNameWithTimestamp = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileNameWithTimestamp);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    };

    const imageUploadPromises = filteredImages.map(async (image) => {
      if (image.imageFile) {
        return uploadFile(image.imageFile).then((url) => {
          image.imageUrl = url; // Set the uploaded image URL
        });
      }
    });

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

    // Wait for all uploads to complete
    await Promise.all([...imageUploadPromises, ...additionalUploads]);

    const imageUrls = filteredImages.map((image) => image.imageUrl);
    const imageDescriptionsDe = filteredImages.map(
      (image) => image.imageDescriptionDe
    );
    const imageDescriptionsEn = filteredImages.map(
      (image) => image.imageDescriptionEn
    );
    const oldImageUrls = oldImages.map((image) => image.imageUrl);
    const oldImageDescriptionsDe = oldImages.map(
      (image) => image.imageDescriptionDe
    );
    const oldImageDescriptionsEn = oldImages.map(
      (image) => image.imageDescriptionEn
    );
    const newImageUrls = [...oldImageUrls, ...imageUrls];
    const newImageDescriptionsDe = [
      ...oldImageDescriptionsDe,
      ...imageDescriptionsDe,
    ];
    const newImageDescriptionsEn = [
      ...oldImageDescriptionsEn,
      ...imageDescriptionsEn,
    ];
    const poiData = {
      ARImage: (await uploadFile(fileARImage)) ?? fileARImageUrl,
      PanoramaImage:
        (await uploadFile(filePanoramaImage)) ?? filePanoramaImageUrl,
      ThumbnailImage: (await uploadFile(thumbDe)) ?? thumbDeUrl,
      TipImage: (await uploadFile(tipDe)) ?? tipDeUrl,
      arActive: isAR,
      arScenelsPanorama: isPanorama,
      gps: GPS,
      images: newImageUrls, // customize
      hideInOverview: willbeHidden,
      languages: {
        de: {
          FirstTextHeading: firstTextHeadingDe,
          POIAddress: addressDe,
          TipDescription: tipDescDe,
          TipLink: tipLinkDe,
          VideoName: videoNameDe,
          audiostory: (await uploadFile(storyDe)) ?? storyDeUrl,
          firstAudio: (await uploadFile(fileDe)) ?? fileDeUrl,
          firstText: descDe,
          imagesDescription: newImageDescriptionsDe, // customize
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
          audiostory: (await uploadFile(storyEn)) ?? storyEnUrl,
          firstAudio: (await uploadFile(fileEn)) ?? fileEnUrl,
          firstText: descEn,
          imagesDescription: newImageDescriptionsEn, // customize
          name: nameEn,
          videoLink: videoLinkEn,
          facebookLink: facebookEn,
          instagramLink: instagramEn,
          weblink: weblinkEn,
        },
      },
      published: published,
    };

    const docRef = doc(db, "poi", poiID);
    await updateDoc(docRef, poiData); // This will only be called after all uploads are done
    setLoading(false);
    navigate("/poi");
  };
  return (
    <DndProvider backend={HTML5Backend}>
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
                    {isFileDe ? (
                      <>
                        <div className="col-span-8">
                          <Input
                            className="bg-white"
                            icon={<PencilSquareIcon />}
                            value={
                              "Aktuelle Datei : " + extractFileName(fileDeUrl)
                            }
                            readOnly
                          />
                          <audio controls className="mt-2">
                            <source src={fileDeUrl} type="audio/mp3" />
                            Your browser does not support the audio tag.
                          </audio>
                        </div>
                        <div className="col-span-1 items-center flex">
                          <TrashIcon
                            strokeWidth={2}
                            className="h-6 w-6 text-[#5A5A5A]  cursor-pointer m-auto"
                            onClick={(e) => {
                              setFileDeUrl("");
                              setIsFileDe(false);
                            }}
                          ></TrashIcon>
                        </div>
                      </>
                    ) : (
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
                    )}
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
                    {isStoryDe ? (
                      <>
                        <div className="col-span-8">
                          <Input
                            className="bg-white"
                            icon={<PencilSquareIcon />}
                            value={
                              "Aktuelle Datei : " + extractFileName(storyDeUrl)
                            }
                            readOnly
                          />
                          <audio controls className="mt-2">
                            <source src={storyDeUrl} type="audio/mp3" />
                            Your browser does not support the audio tag.
                          </audio>
                        </div>
                        <div className="col-span-1 items-center flex">
                          <TrashIcon
                            strokeWidth={2}
                            className="h-6 w-6 text-[#5A5A5A]  cursor-pointer m-auto"
                            onClick={(e) => {
                              setStoryDeUrl("");
                              setIsStoryDe(false);
                            }}
                          ></TrashIcon>
                        </div>
                      </>
                    ) : (
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
                    )}
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
                    {isThumbDe ? (
                      <>
                        <div className="col-span-8">
                          <div className="relative my-2 w-[max-content]">
                            {/* Thumbnail Preview */}
                            <img
                              src={thumbDeUrl}
                              alt="Preview"
                              className="w-72 h-auto rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
                              onClick={() => modalToggleThumbBasic(true)} // Open modal on click
                            />

                            {/* Full-Size Modal */}
                            {isModalOpenThumbBasic && (
                              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <img
                                  src={thumbDeUrl}
                                  alt="Full Size Preview"
                                  className="max-w-full max-h-full rounded-lg shadow-xl"
                                />
                                <button
                                  className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-md"
                                  onClick={() => modalToggleThumbBasic(false)} // Close modal on click
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                          <Input
                            className="bg-white"
                            icon={<PencilSquareIcon />}
                            value={
                              "Aktuelle Datei : " + extractFileName(thumbDeUrl)
                            }
                            readOnly
                          />
                        </div>
                        <div className="col-span-1 items-center flex">
                          <TrashIcon
                            strokeWidth={2}
                            className="h-6 w-6 text-[#5A5A5A]  cursor-pointer m-auto"
                            onClick={(e) => {
                              setThumbDeUrl("");
                              setIsThumbDe(false);
                            }}
                          ></TrashIcon>
                        </div>
                      </>
                    ) : (
                      <div className="col-span-9">
                        <FileInput
                          className="text-[#5A5A5A]"
                          accept="image/*"
                          id="file-upload"
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
                    )}
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
                    {isFileEn ? (
                      <>
                        <div className="col-span-8">
                          <Input
                            className="bg-white"
                            icon={<PencilSquareIcon />}
                            value={
                              "Aktuelle Datei : " + extractFileName(fileEnUrl)
                            }
                            readOnly
                          />
                          <audio controls className="mt-2">
                            <source src={fileEnUrl} type="audio/mp3" />
                            Your browser does not support the audio tag.
                          </audio>
                        </div>
                        <div className="col-span-1 items-center flex">
                          <TrashIcon
                            strokeWidth={2}
                            className="h-6 w-6 text-[#5A5A5A]  cursor-pointer m-auto"
                            onClick={(e) => {
                              setFileEnUrl("");
                              setIsFileEn(false);
                            }}
                          ></TrashIcon>
                        </div>
                      </>
                    ) : (
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
                    )}
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
                    {isStoryEn ? (
                      <>
                        <div className="col-span-8">
                          <Input
                            className="bg-white"
                            icon={<PencilSquareIcon />}
                            value={
                              "Aktuelle Datei : " + extractFileName(storyEnUrl)
                            }
                            readOnly
                          />
                          <audio controls className="mt-2">
                            <source src={storyEnUrl} type="audio/mp3" />
                            Your browser does not support the audio tag.
                          </audio>
                        </div>
                        <div className="col-span-1 items-center flex">
                          <TrashIcon
                            strokeWidth={2}
                            className="h-6 w-6 text-[#5A5A5A]  cursor-pointer m-auto"
                            onClick={(e) => {
                              setStoryEnUrl("");
                              setIsStoryEn(false);
                            }}
                          ></TrashIcon>
                        </div>
                      </>
                    ) : (
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
                    )}
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
            {oldImages.map((oldImage, index) => {
              return <Item key={index} item={oldImage} index={index} />;
            })}
          </div>
          <div className="grid grid-cols-12 gap-4 items-center mb-6">
            <div className="col-span-1"></div>
            <div className="col-span-11">
              {images.map((image, index) => {
                return !image.isHidden ? (
                  <>
                    <div className="grid grid-cols-12 mb-6" key={index}>
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
                  </>
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
              <PlusCircleIcon
                strokeWidth={2}
                color="#5A5A5A"
                className="h-6 w-6"
              >
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
              <h1 className="text-[#5A5A5A] text-3xl font-normal mb-12">
                Tipp
              </h1>
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
                    {isTipDe ? (
                      <>
                        <div className="col-span-8">
                          <div className="relative my-2 w-[max-content]">
                            {/* Thumbnail Preview */}
                            <img
                              src={tipDeUrl}
                              alt="Preview"
                              className="w-72 h-auto rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
                              onClick={() => modalToggleTipDeBasic(true)} // Open modal on click
                            />

                            {/* Full-Size Modal */}
                            {isModalOpenTipDeBasic && (
                              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <img
                                  src={tipDeUrl}
                                  alt="Full Size Preview"
                                  className="max-w-full max-h-full rounded-lg shadow-xl"
                                />
                                <button
                                  className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-md"
                                  onClick={() => modalToggleTipDeBasic(false)} // Close modal on click
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                          <Input
                            className="bg-white"
                            icon={<PencilSquareIcon />}
                            value={
                              "Aktuelle Datei : " + extractFileName(tipDeUrl)
                            }
                            readOnly
                          />
                        </div>
                        <div className="col-span-1 items-center flex">
                          <TrashIcon
                            strokeWidth={2}
                            className="h-6 w-6 text-[#5A5A5A]  cursor-pointer m-auto"
                            onClick={(e) => {
                              setTipDeUrl("");
                              setIsTipDe(false);
                            }}
                          ></TrashIcon>
                        </div>
                      </>
                    ) : (
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
                    )}
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
                  <Tooltip
                    content="Zugewiesene Datei hochladen"
                    placement="top"
                  >
                    <InformationCircleIcon
                      strokeWidth={2}
                      className="h-10 w-10 text-[#5A5A5A]"
                    ></InformationCircleIcon>
                  </Tooltip>
                </div>
                <div className="col-span-2 flex items-center justify-center pr-2 text-[#5A5A5A] text-xl">
                  AR Standort
                </div>
                {isFileARImage ? (
                  <>
                    <div className="col-span-8">
                      <div className="relative my-2 w-[max-content]">
                        {/* Thumbnail Preview */}
                        <img
                          src={fileARImageUrl}
                          alt="Preview"
                          className="w-72 h-auto rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
                          onClick={() => modalToggleARBasic(true)} // Open modal on click
                        />

                        {/* Full-Size Modal */}
                        {isModalOpenARBasic && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <img
                              src={fileARImageUrl}
                              alt="Full Size Preview"
                              className="max-w-full max-h-full rounded-lg shadow-xl"
                            />
                            <button
                              className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-md"
                              onClick={() => modalToggleARBasic(false)} // Close modal on click
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                      <Input
                        className="bg-white"
                        icon={<PencilSquareIcon />}
                        value={
                          "Aktuelle Datei : " + extractFileName(fileARImageUrl)
                        }
                        readOnly
                      />
                    </div>
                    <div className="col-span-1 items-center flex">
                      <TrashIcon
                        strokeWidth={2}
                        className="h-6 w-6 text-[#5A5A5A]  cursor-pointer m-auto"
                        onClick={(e) => {
                          setFileARImageUrl("");
                          setIsFileARImage(false);
                        }}
                      ></TrashIcon>
                    </div>
                  </>
                ) : (
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
                )}
              </div>
              <div className="grid grid-cols-12 gap-4 items-center mb-6">
                <div className="col-span-1">
                  <Tooltip
                    content="Zugewiesene Datei hochladen"
                    placement="top"
                  >
                    <InformationCircleIcon
                      strokeWidth={2}
                      className="h-10 w-10 text-[#5A5A5A]"
                    ></InformationCircleIcon>
                  </Tooltip>
                </div>
                <div className="col-span-2 flex items-center justify-center pr-2 text-[#5A5A5A] text-xl">
                  Panoramabild
                </div>
                {isFilePanoramaImage ? (
                  <>
                    <div className="col-span-8">
                      <div className="relative my-2 w-[max-content]">
                        {/* Thumbnail Preview */}
                        <img
                          src={filePanoramaImageUrl}
                          alt="Preview"
                          className="w-72 h-auto rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
                          onClick={() => modalTogglePanoramaBasic(true)} // Open modal on click
                        />

                        {/* Full-Size Modal */}
                        {isModalOpenPanoramaBasic && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <img
                              src={filePanoramaImageUrl}
                              alt="Full Size Preview"
                              className="max-w-full max-h-full rounded-lg shadow-xl"
                            />
                            <button
                              className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-md"
                              onClick={() => modalTogglePanoramaBasic(false)} // Close modal on click
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                      <Input
                        className="bg-white"
                        icon={<PencilSquareIcon />}
                        value={
                          "Aktuelle Datei : " +
                          extractFileName(filePanoramaImageUrl)
                        }
                        readOnly
                      />
                    </div>
                    <div className="col-span-1 items-center flex">
                      <TrashIcon
                        strokeWidth={2}
                        className="h-6 w-6 text-[#5A5A5A]  cursor-pointer m-auto"
                        onClick={(e) => {
                          setFilePanoramaImageUrl("");
                          setIsFilePanoramaImage(false);
                        }}
                      ></TrashIcon>
                    </div>
                  </>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="border-b-4 border-[#5A5A5A] mx-5 mb-20">
          <div className="container m-auto mt-20 pb-12"></div>
        </div>
        <div className="container m-auto mb-40">
          <h1 className="text-[#5A5A5A] text-3xl font-normal mb-12">
            Weiteres
          </h1>
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
    </DndProvider>
  );
};

export default EditPoiPage;
