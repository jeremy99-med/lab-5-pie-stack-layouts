const margin = {top: 50, right: 0, bottom: 50, left: 70};
const width = 900;
const height = 350;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const formatsInfo = [
  {id: "action", label: "Action", color: "#FF5733"},
  {id: "adventure", label: "Adventure", color: "#33FF57"},
  {id: "drama", label: "Drama", color: "#3357FF"},
  {id: "comedy", label: "Comedy", color: "#FF33A1"},
  {id: "thriller", label: "Thriller or Suspense", color: "#FF8C33"},
  {id: "horror", label: "Horror", color: "#FF3333"},
  {id: "romantic_comedy", label: "Romantic Comedy", color: "#FF33FF"},
  {id: "musical", label: "Musical", color: "#33FFF5"},
  {id: "documentary", label: "Documentary", color: "#F5FF33"},
  {id: "dark_comedy", label: "Dark Comedy", color: "#A1FF33"},
  {id: "western", label: "Western", color: "#FFC300"},
  {id: "concert", label: "Concert or Performance", color: "#DAF7A6"},
  {id: "multiple_genres", label: "Multiple Genres", color: "#C70039"},
  {id: "reality", label: "Reality", color: "#900C3F"},
];