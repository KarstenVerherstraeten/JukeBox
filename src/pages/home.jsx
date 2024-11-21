import React from "react";
import SearchBar from "../components/searchbar";
import style from "../modules/home.module.css";
import Footer from "../components/Footer";


const Home = () => {
	return (
		<>
			<div className={style.header}>
				<h1 className={style.title}>Welkom to the Jukebox</h1>
				<div className={style.search}>
					<SearchBar />
				</div>
			</div>

			<div className="Trending">
            </div>

            <Footer />
		</>
	);
};

export default Home;
