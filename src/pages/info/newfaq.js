import React from "react";
import { Helmet } from "react-helmet";
import { NavbarWithMegaMenu } from "../components/navbar";
import "./index.css";
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
const NewFaqPage = () => {
  const navigate = useNavigate();
  const audioRefDe = useRef(null);
  const audioRefEn = useRef(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [titleDe, setTitleDe] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descDe, setDescDe] = useState("");
  const [published, setPublished] = useState(false);
  const [linksDe, setLinksDe] = useState([]);
  const [linksEn, setLinksEn] = useState([]);
  const [titleDeError, setTitleDeError] = useState(false);
  const [titleEnError, setTitleEnError] = useState(false);
  const [descDeError, setDescDeError] = useState(false);
  const [descEnError, setDescEnError] = useState(false);
  const handleInputDeChange = (index, event) => {
    const newLinks = [...linksDe]; // Create a copy of the state array
    newLinks[index] = event.target.value; // Update the specific index with the new value
    setLinksDe(newLinks); // Update the state
  };

  // Function to add a new item to the linksDe array
  const addNewLink = () => {
    setLinksDe([...linksDe, ""]); // Add a new empty string to the array
  };
  const handleInputEnChange = (index, event) => {
    const newLinks = [...linksEn]; // Create a copy of the state array
    newLinks[index] = event.target.value; // Update the specific index with the new value
    setLinksEn(newLinks); // Update the state
  };

  // Function to add a new item to the linksDe array
  const addNewEnLink = () => {
    setLinksEn([...linksEn, ""]); // Add a new empty string to the array
  };
  const [fileDe, setDeFile] = useState(null);
  const [audioSrcDe, setAudioSrcDe] = useState(null);
  const [audioSrcEn, setAudioSrcEn] = useState(null);

  const [fileEn, setEnFile] = useState(null);
  const [fileDeUrl, setFileDeUrl] = useState("");

  const [fileEnUrl, setFileEnUrl] = useState("");
  const handleFileDeChange = (event) => {
    const selectedFile = event.target.files[0];
    setDeFile(selectedFile);
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
    setEnFile(selectedFile);
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
  const onSubmit = async () => {
    if (titleDe === "" || titleEn === "" || descDe === "" || descEn === "")
      setError(true);
    if (titleDe === "") return setTitleDeError(true);
    if (descDe === "") return setDescDeError(true);
    if (titleEn === "") return setTitleEnError(true);
    if (descEn === "") return setDescEnError(true);

    setLoading(true);

    try {
      // Get the highest priority from the database
      const q = query(
        collection(db, "faq"),
        orderBy("priority", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      let maxPriority = querySnapshot.empty
        ? 0
        : querySnapshot.docs[0].data().priority;

      const filteredLinksDe = linksDe.filter((link) => link.trim() !== "");
      const filteredLinksEn = linksEn.filter((link) => link.trim() !== "");

      const uploadFile = async (file) => {
        const timestamp = Date.now(); // Get the current timestamp
        const fileNameWithTimestamp = `${timestamp}_${file.name}`;
        const storageRef = ref(storage, fileNameWithTimestamp);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      };

      // Upload files in parallel using Promise.all
      const [fileDeUrl, fileEnUrl] = await Promise.all([
        fileDe ? uploadFile(fileDe) : Promise.resolve(null),
        fileEn ? uploadFile(fileEn) : Promise.resolve(null),
      ]);

      const faqData = {
        languages: {
          de: {
            audio: fileDeUrl,
            description: descDe,
            links: filteredLinksDe,
            title: titleDe,
          },
          en: {
            audio: fileEnUrl,
            description: descEn,
            links: filteredLinksEn,
            title: titleEn,
          },
        },
        priority: maxPriority + 1,
        published: published,
      };

      // Add the new FAQ to the database
      await addDoc(collection(db, "faq"), faqData);

      setLoading(false);
      navigate("/faq");
    } catch (error) {
      console.error("Error during submission:", error);
      setLoading(false);
    }
  };
  return (
    <>
      <Helmet>
        <title>Neuen FAQ Beitrag erstellen | BremenGo</title>
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
          <h1 className="text-[#5A5A5A] text-3xl font-medium">FAQ-Eintrag</h1>
        </div>
      </div>
      <div className="container m-auto mt-12">
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <div className="text-center m-auto mb-16">
              <img src={DeuFlagImg} className="m-auto" />
              <h1 className="text-3xl">Neuer FAQ-Eintrag</h1>
            </div>
            <h1 className="text-[#5A5A5A] text-3xl font-normal mb-12">
              Einleitung
            </h1>
            <div className="grid grid-cols-12 gap-4 items-center mb-6">
              <div className="col-span-1">
                <Tooltip content="Frage, max. 100 Zeichen" placement="top">
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
                      value={titleDe}
                      onChange={(e) => {
                        setTitleDe(e.target.value);
                        setTitleDeError(false);
                        setError(false);
                      }}
                    />
                    {titleDeError ? (
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
                  content="Redaktionelle Antwort, unbegrenzte Anzahl an Zeichen"
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
                  content="Vorlesetext für Barrierefreiheit, Audioformat: mp3"
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
            <div className="grid grid-cols-12 gap-4 items-center mb-2">
              <div className="col-span-1">
                <Tooltip
                  content="Ggf. Weblink zu weiteren relevanten Informationen"
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
                    Links
                  </div>
                  <div className="col-span-9 gap-8">
                    {linksDe.map((linkDe, index) => {
                      return (
                        <Input
                          className="bg-white mb-8"
                          key={index}
                          icon={<PencilSquareIcon />}
                          value={linkDe}
                          onChange={(event) =>
                            handleInputDeChange(index, event)
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-2">
              <div
                className="text-[#5A5A5A] text-xl text-center mt-2 inline-flex items-center cursor-pointer"
                onClick={addNewLink}
              >
                Neuen Link hinzufügen
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
          <div>
            <div className="text-center m-auto mb-16">
              <img src={AMFlagImg} className="m-auto" />
              <h1 className="text-3xl">New FAQ entry</h1>
            </div>
            <h1 className="text-[#5A5A5A] text-3xl font-normal mb-12">
              <br />
            </h1>
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
                      value={titleEn}
                      onChange={(e) => {
                        setTitleEnError(false);
                        setError(false);
                        setTitleEn(e.target.value);
                      }}
                    />
                    {titleEnError ? (
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
            <div className="grid grid-cols-12 gap-4 items-center mb-2">
              <div className="col-span-1"></div>
              <div className="col-span-11">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                    Links
                  </div>
                  <div className="col-span-9 gap-8">
                    {linksEn.map((linkEn, index) => {
                      return (
                        <Input
                          className="bg-white mb-8"
                          key={index}
                          icon={<PencilSquareIcon />}
                          value={linkEn}
                          onChange={(event) =>
                            handleInputEnChange(index, event)
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-2">
              <div
                className="text-[#5A5A5A] text-xl text-center mt-2 inline-flex items-center"
                onClick={addNewEnLink}
              >
                Neuen Link hinzufügen
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
        </div>
      </div>
      <div className="border-b-4 border-[#5A5A5A] mx-5 mb-40">
        <div className="container m-auto mt-20 pb-12"></div>
      </div>
      <div className="container m-auto mb-40">
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
            <Link to="/faq">
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

export default NewFaqPage;