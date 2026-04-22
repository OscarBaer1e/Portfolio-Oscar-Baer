import React, { useRef, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(102, 101, 221, 0.35)",
}) {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (event) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return React.createElement(
    "article",
    {
      ref: divRef,
      onMouseMove: handleMouseMove,
      onFocus: () => {
        setIsFocused(true);
        setOpacity(0.7);
      },
      onBlur: () => {
        setIsFocused(false);
        setOpacity(0);
      },
      onMouseEnter: () => setOpacity(0.7),
      onMouseLeave: () => setOpacity(0),
      className: `about-highlight-card about-highlight-card--reactbits ${className}`,
      tabIndex: 0,
    },
    React.createElement("div", {
      className: "about-spotlight-layer",
      style: {
        opacity,
        background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 72%)`,
      },
    }),
    React.createElement("div", { className: "about-highlight-content" }, children)
  );
}

function HighlightsGrid() {
  const items = [
    {
      icon: "fas fa-calendar-check",
      title: "Disponibilite",
      text: "Recherche d'alternance a partir de septembre 2026.",
    },
    {
      icon: "fas fa-bullseye",
      title: "Positionnement",
      text: "Developpement web, design UX/UI et creation audiovisuelle.",
    },
    {
      icon: "fas fa-users",
      title: "Methode",
      text: "Travail en equipe, gestion de projet Agile et documentation claire.",
    },
  ];

  return React.createElement(
    "div",
    { className: "about-highlights about-highlights--reactbits" },
    ...items.map((item) =>
      React.createElement(
        SpotlightCard,
        { key: item.title },
        React.createElement(
          "h4",
          null,
          React.createElement("i", { className: item.icon, "aria-hidden": "true" }),
          " ",
          item.title
        ),
        React.createElement("p", null, item.text)
      )
    )
  );
}

function mountReactBitsHighlights() {
  const rootElement = document.getElementById("reactbits-highlights-root");
  if (!rootElement) return;

  const staticHighlights = document.getElementById("about-highlights-static");
  if (staticHighlights) staticHighlights.hidden = true;

  rootElement.hidden = false;
  const root = createRoot(rootElement);
  root.render(React.createElement(HighlightsGrid));
}

mountReactBitsHighlights();
