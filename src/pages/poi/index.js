import React from "react";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { NavbarWithMegaMenu } from "../components/navbar";
import { Link } from "react-router-dom";
import {
  TrashIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  Square2StackIcon,
} from "@heroicons/react/24/outline";
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
import { Spinner } from "@material-tailwind/react";
const PoiPage = () => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchAndSortByName = async () => {
      const querySnapshot = await getDocs(collection(db, "poi"));

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortedData = data.sort((a, b) => {
        const nameA = a.languages?.de?.name?.toLowerCase() || "";
        const nameB = b.languages?.de?.name?.toLowerCase() || "";
        return nameA.localeCompare(nameB);
      });

      setData(sortedData); // Data ordered by 'de.name'
    };

    fetchAndSortByName();
  }, []);
  const removeItem = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "poi", id));
      // Optionally, remove the deleted item from the state to update the UI
      setData(data.filter((item) => item.id !== id));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error deleting document: ", error);
    }
  };
  const cloneItem = async (id) => {
    try {
      setLoading(true);
      // Get the document to be cloned
      const docRef = doc(db, "poi", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const docData = docSnap.data();

        // Clone the document with the new priority (maxPriority + 1)
        const newDocData = {
          ...docData,
          languages: {
            ...docData.languages,
            de: {
              ...docData.languages.de,
              name: `${docData.languages.de.name} (clone)`, // Append " (clone)" to the German title
            },
            en: {
              ...docData.languages.en,
              name: `${docData.languages.en.name} (clone)`, // Append " (clone)" to the English title
            },
          },
        };
        // Add the new document to Firestore
        await addDoc(collection(db, "poi"), newDocData);

        const fetchAndSortByName = async () => {
          const querySnapshot = await getDocs(collection(db, "poi"));

          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const sortedData = data.sort((a, b) => {
            const nameA = a.languages?.de?.name?.toLowerCase() || "";
            const nameB = b.languages?.de?.name?.toLowerCase() || "";
            return nameA.localeCompare(nameB);
          });

          setData(sortedData); // Data ordered by 'de.name'
        };

        fetchAndSortByName();
        setLoading(false);
        console.log("Document cloned successfully with higher priority!");
      } else {
        setLoading(false);
        console.log("No such document!");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error cloning document: ", error);
    }
  };
  return (
    <>
      <Helmet>
        <title>POI Übersicht | BremenGo</title>
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
          <h1 className="text-[#5A5A5A] text-3xl font-medium">POI Übersicht</h1>
        </div>
      </div>
      <div className="container m-auto mt-12">
        <div>
          {data.map((item, index) => {
            return (
              <div
                className="grid grid-cols-12 gap-8 items-center mb-6"
                key={index}
              >
                <div className="text-[#5A5A5A]">{index}.</div>
                <div className="col-span-8">
                  <input
                    className="rounded-lg text-xl focus:outline-none px-4 py-2 w-full text-[#5A5A5A]"
                    value={item.languages.de.name}
                    readOnly
                  />
                </div>
                <div>
                  <Square2StackIcon
                    color="#5A5A5A"
                    strokeWidth={2.5}
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => cloneItem(item.id)}
                  ></Square2StackIcon>
                </div>
                <div>
                  <Link to={"/poi/" + item.id}>
                    <PencilSquareIcon
                      color="#5A5A5A"
                      strokeWidth={2.5}
                      className="h-6 w-6 cursor-pointer"
                    ></PencilSquareIcon>
                  </Link>
                </div>
                <div>
                  <TrashIcon
                    color="#5A5A5A"
                    strokeWidth={2.5}
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => removeItem(item.id)}
                  ></TrashIcon>
                </div>
              </div>
            );
          })}

          <div className="text-center my-12">
            <Link
              className="text-[#5A5A5A] text-2xl text-center mt-12 inline-flex items-center"
              to={"/poi/new"}
            >
              Neuen POI erstellen
              <PlusCircleIcon
                strokeWidth={2}
                color="#5A5A5A"
                className="h-7 w-7"
              >
                {" "}
              </PlusCircleIcon>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PoiPage;
