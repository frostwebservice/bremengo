import React from "react";
import { Helmet } from "react-helmet";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { NavbarWithMegaMenu } from "../components/navbar";
import "./index.css";
import { Link } from "react-router-dom";
import {
  TrashIcon,
  PencilSquareIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  addDoc,
  query,
  limit,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db, auth, storage } from "../../config/firebase-config";
import { Spinner } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemTypes = {
  CARD: "card",
};
const OffersNews = () => {
  const moveItem = (dragIndex, hoverIndex) => {
    const draggedItem = events[dragIndex];
    const newSortedItems = [...events];
    newSortedItems.splice(dragIndex, 1);
    newSortedItems.splice(hoverIndex, 0, draggedItem);
    setEvents(newSortedItems);
  };
  const moveExperienceItem = (dragIndex, hoverIndex) => {
    const draggedItem = experiences[dragIndex];
    const newSortedItems = [...experiences];
    newSortedItems.splice(dragIndex, 1);
    newSortedItems.splice(hoverIndex, 0, draggedItem);
    setExperiences(newSortedItems);
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
        events.map(async (event, index) => {
          const eventData = {
            ...event,
            priority: index + 1,
          };
          const docRef = doc(db, "events", event.id);
          await updateDoc(docRef, eventData);
        });
      },
    });

    const opacity = isDragging ? 0.5 : 1;

    return (
      <div
        ref={(node) => drag(drop(node))}
        className={`grid grid-cols-12 gap-4 items-center mb-6 ${
          isDragging ? "opacity-50" : ""
        }`}
        style={{ cursor: "move" }}
      >
        <div className="text-[#5A5A5A]">{index}.</div>
        <div className="col-span-8">
          <input
            className="rounded-lg text-xl focus:outline-none px-4 py-1 w-full text-[#5A5A5A]"
            value={item.languages.de.title}
            readOnly
          />
        </div>
        <div>
          <Link to={"/events/" + item.id}>
            <PencilSquareIcon
              color="#5A5A5A"
              strokeWidth={2.5}
              className="h-6 w-6"
            ></PencilSquareIcon>
          </Link>
        </div>
        <div>
          <TrashIcon
            onClick={() => {
              removeEvent(item.id);
            }}
            color="#5A5A5A"
            strokeWidth={2.5}
            className="h-6 w-6 cursor-pointer"
          ></TrashIcon>
        </div>
        <div></div>
      </div>
    );
  };
  const ExperienceItem = ({ item, index }) => {
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

        moveExperienceItem(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
      drop: (item) => {
        experiences.map(async (experience, index) => {
          const experienceData = {
            ...experience,
            priority: index + 1,
          };
          const docRef = doc(db, "experiences", experience.id);
          await updateDoc(docRef, experienceData);
        });
      },
    });

    const opacity = isDragging ? 0.5 : 1;

    return (
      <div
        ref={(node) => drag(drop(node))}
        className={`grid grid-cols-12 gap-4 items-center mb-6 ${
          isDragging ? "opacity-50" : ""
        }`}
        style={{ cursor: "move" }}
      >
        <div className="text-[#5A5A5A]">{index}.</div>
        <div className="col-span-8">
          <input
            className="rounded-lg text-xl focus:outline-none px-4 py-1 w-full text-[#5A5A5A]"
            value={item.languages.de.title}
            readOnly
          />
        </div>
        <div>
          <Link to={"/experiences/" + item.id}>
            <PencilSquareIcon
              color="#5A5A5A"
              strokeWidth={2.5}
              className="h-6 w-6"
            ></PencilSquareIcon>
          </Link>
        </div>
        <div>
          <TrashIcon
            onClick={() => {
              removeExperience(item.id);
            }}
            color="#5A5A5A"
            strokeWidth={2.5}
            className="h-6 w-6 cursor-pointer"
          ></TrashIcon>
        </div>
        <div></div>
      </div>
    );
  };
  const [loading, setLoading] = useState(false);

  const [events, setEvents] = useState([]);
  const [experiences, setExperiences] = useState([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("priority"));

        const querySnapshot = await getDocs(q);

        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Include document ID if needed
          ...doc.data(), // Spread document data
        }));
        setEvents(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchEvents();
    const fetchExperiences = async () => {
      try {
        const q = query(collection(db, "experiences"), orderBy("priority"));

        const querySnapshot = await getDocs(q);

        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Include document ID if needed
          ...doc.data(), // Spread document data
        }));
        setExperiences(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchExperiences();
  }, []);
  const removeEvent = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "events", id));
      // Optionally, remove the deleted item from the state to update the UI
      setEvents(events.filter((item) => item.id !== id));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error deleting document: ", error);
    }
  };
  const removeExperience = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "experiences", id));
      // Optionally, remove the deleted item from the state to update the UI
      setExperiences(experiences.filter((item) => item.id !== id));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error deleting document: ", error);
    }
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <>
        <Helmet>
          <title>Home-Screen | BremenGo</title>
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
              Home Screen bearbeiten
            </h1>
          </div>
        </div>
        <div className="container m-auto mt-12 mb-20">
          <div className="grid lg:grid-cols-2">
            <div>
              <h1 className="text-[#5A5A5A] text-3xl font-normal mb-12">
                Erlebnis-Einträge
              </h1>
              {events.map((event, index) => {
                return <Item key={index} item={event} index={index} />;
              })}

              <div className="text-center mt-12">
                <Link
                  className="text-[#5A5A5A] text-2xl text-center mt-12 inline-flex items-center"
                  to={"/events/new"}
                >
                  Neuen Erlebnis-Eintrag erstellen
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
            <div>
              {" "}
              <h1 className="text-[#5A5A5A] text-3xl font-normal mb-12">
                Entdecken-Einträge
              </h1>
              {experiences.map((experience, index) => {
                return (
                  <ExperienceItem key={index} item={experience} index={index} />
                );
              })}
              <div className="text-center mt-12">
                <Link
                  className="text-[#5A5A5A] text-2xl mt-12 inline-flex items-center"
                  to={"/experiences/new"}
                >
                  Neuen Entdecken-Eintrag erstellen
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
        </div>
      </>
    </DndProvider>
  );
};

export default OffersNews;
