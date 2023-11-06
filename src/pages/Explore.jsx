/**
   * This is how we define route parameters in React Router.
  If you have a route "/category/:categoryName"
  Then in your component that you are using to show that route, you can access whatever was in the url in place of /:categoryName using the useParams hook.
  So you would have available in your component...
  const { categoryName } = useParams()
  So if we had in the url bar...
  localhost:3000/category/rent
  Then in our component categoryName would be 'rent'
  So in the Explore page if we clicked a link that went to /category/rent then in our Category component when we use useParams we would get 'rent' as the categoryName. If we clicked a link that took us to /category/sale then 'sale' would be the categoryName.
You can read more about the Route component and route parameters here.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';

function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
        <main>
          {/* slider goes here */}
          <p className="exploreCategoryHeading">Categories</p>
          <div className="exploreCategories">
            {/* Rent card */}
            <Link to="/category/rent">
              <img
                src={rentCategoryImage}
                alt="Rent "
                className="exploreCategoryImg"
              />
              <p className="exploreCategoryName">Places for Rent</p>
            </Link>
            {/* sale card */}
            <Link to="/category/sale">
              <img
                src={sellCategoryImage}
                alt="Sale"
                className="exploreCategoryImg"
              />
              <p className="exploreCategoryName">Places for Sale</p>
            </Link>
          </div>
        </main>
      </header>
    </div>
  );
}

export default Explore;
