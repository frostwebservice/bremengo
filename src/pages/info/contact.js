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
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  query,
  limit,
  orderBy,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db, auth, storage } from "../../config/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
const ContactPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");
  const [person, setPerson] = useState("");
  const [type, setType] = useState("contact");
  const [email, setEmail] = useState("");
  const [isCreate, setIsCreate] = useState(true);
  const [published, setPublished] = useState(false);

  const [links, setLinks] = useState([]);
  const [addressError, setAddressError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [faxError, setFaxError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [personError, setPersonError] = useState(false);
  useEffect(() => {
    const fetchContacts = async () => {
      const q = query(collection(db, "page"), where("type", "==", "contact"));
      const querySnapshot = await getDocs(q);
      const contactList = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Include document ID if needed
        ...doc.data(),
      }));
      if (contactList.empty) {
        setIsCreate(true);
      } else {
        setData(contactList[0]);
        setIsCreate(false);
        setAddress(contactList[0].Address);
        setPhone(contactList[0].PhoneNumber);
        setFax(contactList[0].FaxNumber);
        setPerson(contactList[0].ContactPerson);
        setEmail(contactList[0].Email);
        setPublished(contactList[0].published);
        setLinks(contactList[0].Website);
      }
    };

    fetchContacts();
  }, []);

  const handleInputChange = (index, event) => {
    const newLinks = [...links]; // Create a copy of the state array
    newLinks[index] = event.target.value; // Update the specific index with the new value
    setLinks(newLinks); // Update the state
  };

  // Function to add a new item to the linksDe array
  const addNewLink = () => {
    setLinks([...links, ""]); // Add a new empty string to the array
  };

  const onSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (address === "") {
      setAddressError(true);
      setError(true);
      return;
    } else if (person === "") {
      setPersonError(true);
      setError(true);
      return;
    } else if (email === "" || !emailRegex.test(email)) {
      setEmailError(true);
      setError(true);
      return;
    } else if (fax === "") {
      setFaxError(true);
      setError(true);
      return;
    } else if (phone === "") {
      setPhoneError(true);
      setError(true);
      return;
    }

    setLoading(true);
    const filteredLinks = links.filter((link) => link.trim() !== "");

    const contactData = {
      Address: address,
      ContactPerson: person,
      Email: email,
      FaxNumber: fax,
      PhoneNumber: phone,
      Website: filteredLinks,
      published: published,
      type: "contact",
    };
    if (isCreate) {
      await addDoc(collection(db, "page"), contactData);
      setLoading(false);
      navigate("/page");
    } else {
      const docRef = doc(db, "page", data.id);
      await updateDoc(docRef, contactData);
      setLoading(false);
      navigate("/page");
    }
  };
  return (
    <>
      <Helmet>
        <title>Bearbeiten Contact | BremenGo</title>
        <meta name="description" content="BremenGo Contact" />
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
            Bearbeiten Contact
          </h1>
        </div>
      </div>
      <div className="container m-auto mt-12">
        <div>
          <h1 className="text-[#5A5A5A] text-3xl font-normal mb-12">
            Einleitung
          </h1>
          <div className="grid grid-cols-12 gap-4 items-center mb-6">
            <div className="col-span-12">
              <div className="grid grid-cols-12">
                <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                  Überschrift
                </div>
                <div className="col-span-9">
                  <Input
                    className="bg-white"
                    //   icon={<PencilSquareIcon />}
                    value="Kontakt"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 items-center mb-6">
            <div className="col-span-12">
              <div className="grid grid-cols-12">
                <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                  Adresse
                </div>
                <div className="col-span-9">
                  <Input
                    className="bg-white"
                    icon={<PencilSquareIcon />}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setError(false);
                      setAddressError(false);
                    }}
                  />
                  {addressError ? (
                    <p className="text-red-800">Please fill out this field.</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 items-center mb-6">
            <div className="col-span-12">
              <div className="grid grid-cols-12">
                <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                  Kontaktperson
                </div>
                <div className="col-span-9">
                  <Input
                    className="bg-white"
                    icon={<PencilSquareIcon />}
                    value={person}
                    onChange={(e) => {
                      setPerson(e.target.value);
                      setError(false);
                      setPersonError(false);
                    }}
                  />
                  {personError ? (
                    <p className="text-red-800">Please fill out this field.</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 items-center mb-6">
            <div className="col-span-12">
              <div className="grid grid-cols-12">
                <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                  E-Mail
                </div>
                <div className="col-span-9">
                  <Input
                    className="bg-white"
                    icon={<PencilSquareIcon />}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(false);
                      setError(false);
                    }}
                  />
                  {emailError ? (
                    <p className="text-red-800">
                      Please enter a valid email address.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 items-center mb-6">
            <div className="col-span-12">
              <div className="grid grid-cols-12">
                <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                  Fax
                </div>
                <div className="col-span-9">
                  <Input
                    className="bg-white"
                    icon={<PencilSquareIcon />}
                    value={fax}
                    onChange={(e) => {
                      setFax(e.target.value);
                      setFaxError(false);
                      setError(false);
                    }}
                  />
                  {faxError ? (
                    <p className="text-red-800">Please fill out this field.</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 items-center mb-6">
            <div className="col-span-12">
              <div className="grid grid-cols-12">
                <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                  Telefonnummer
                </div>
                <div className="col-span-9">
                  <Input
                    className="bg-white"
                    icon={<PencilSquareIcon />}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneError(false);
                      setError(false);
                    }}
                  />
                  {phoneError ? (
                    <p className="text-red-800">Please fill out this field.</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 items-center mb-2">
            <div className="col-span-12">
              <div className="grid grid-cols-12">
                <div className="col-span-3 flex items-center justify-end pr-2 text-[#5A5A5A] text-xl">
                  Website
                </div>
                <div className="col-span-9 gap-8">
                  {links.map((link, index) => {
                    return (
                      <Input
                        className="bg-white mb-8"
                        key={index}
                        icon={<PencilSquareIcon />}
                        value={link}
                        onChange={(event) => handleInputChange(index, event)}
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
            <Link to="/page">
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

export default ContactPage;
