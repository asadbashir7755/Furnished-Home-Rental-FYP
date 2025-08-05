import "../../Styles/hero.css"; // Ensure this path is correct and matches case sensitivity
import SearchBar from "./SearchBar"; // Import the SearchBar component

const Hero = () => {
  return (
    <section className="hero" style={{ backgroundColor: "white", color: "black" }}>
      <div className="hero-content">
        <h1>Find your next stay</h1>
        <p>Search deals on hotels, homes, and much more...</p>
      </div>
      <SearchBar /> {/* Include the SearchBar component */}
    </section>
  );
};

export default Hero;
