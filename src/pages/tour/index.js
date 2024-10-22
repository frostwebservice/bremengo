import React from "react";
import { Helmet } from "react-helmet";
import { NavbarWithMegaMenu } from "../components/navbar";
import "./index.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState, useEffect } from "react";
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
  updateDoc,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db, auth, storage } from "../../config/firebase-config";
import { Spinner } from "@material-tailwind/react";
import { useDrag, useDrop } from "react-dnd";

const ItemTypes = {
  CARD: "card",
};
const TourPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const moveItem = (dragIndex, hoverIndex) => {
    const draggedItem = data[dragIndex];
    const newSortedItems = [...data];
    newSortedItems.splice(dragIndex, 1);
    newSortedItems.splice(hoverIndex, 0, draggedItem);
    setData(newSortedItems);
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
      drop: (item) => {
        data.map(async (tour, index) => {
          const tourData = {
            ...tour,
            priority: index + 1,
          };
          const docRef = doc(db, "tour", tour.id);
          await updateDoc(docRef, tourData);
        });
      },
    });

    const opacity = isDragging ? 0.5 : 1;

    return (
      <div
        ref={(node) => drag(drop(node))}
        className={`tour-card p-20 ${isDragging ? "opacity-50" : ""}`}
        style={{ cursor: "move" }}
      >
        <h2 className="text-[#5A5A5A] m-auto text-center text-md my-10">
          {item.languages.de.name}
        </h2>
        <div className="grid grid-cols-3 flex justify-items-center mb-4">
          <div>
            <Square2StackIcon
              color="#5A5A5A"
              strokeWidth={2.5}
              className="h-6 w-6 cursor-pointer"
              onClick={() => cloneItem(item.id)}
            ></Square2StackIcon>
          </div>
          <div>
            <Link to={"/tour/" + item.id}>
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
      </div>
    );
  };
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "tour"), orderBy("priority"));

        const querySnapshot = await getDocs(q);

        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Include document ID if needed
          ...doc.data(), // Spread document data
        }));
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchEvents();
  }, []);
  const removeItem = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "tour", id));
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
      const docRef = doc(db, "tour", id);
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
        await addDoc(collection(db, "tour"), newDocData);

        const fetchAndSortByName = async () => {
          const querySnapshot = await getDocs(collection(db, "tour"));

          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          //   const sortedData = data.sort((a, b) => {
          //     const nameA = a.languages?.de?.name?.toLowerCase() || "";
          //     const nameB = b.languages?.de?.name?.toLowerCase() || "";
          //     return nameA.localeCompare(nameB);
          //   });

          setData(data); // Data ordered by 'de.name'
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
    <DndProvider backend={HTML5Backend}>
      <>
        <Helmet>
          <title>Touren Übersicht | BremenGo</title>
          <meta name="description" content="BremenGo Tour Overview" />
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
              Touren Übersicht
            </h1>
          </div>
        </div>
        <div className="container m-auto mt-20">
          <div className="grid lg:grid-cols-4 flex justify-center gap-12">
            {data.map((tour, index) => {
              return <Item key={index} item={tour} index={index} />;
            })}
          </div>
          <div className="text-center mt-12 mb-20">
            <Link
              className="text-[#5A5A5A] text-2xl text-center mt-12 inline-flex items-center"
              to={"/tour/new"}
            >
              Neue Tour erstellen
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
      </>
    </DndProvider>
  );
};

export default TourPage;
