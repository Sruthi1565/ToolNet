import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AboutUs = () => {
  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f4f6f7', color: '#333' }}>
      <div className="container">
        
        {/* Page Title */}
        <h1 className="text-center mb-5" style={{ color: '#00796b', fontWeight: 'bold' }}>About ToolNet</h1>
        
        {/* Introduction Section */}
        <section className="mb-5">
          <h2>What is ToolNet?</h2>
          <p>
            ToolNet is a community-driven tool-sharing platform designed to bring neighbors together, reducing waste and fostering collaboration. 
            Through ToolNet, people can easily borrow and lend tools within their local communities, saving resources and making DIY projects more accessible.
          </p>
        </section>

        {/* Mission Statement */}
        <section className="mb-5">
          <h2>Our Mission</h2>
          <p>
            At ToolNet, our mission is to promote sustainable living and strengthen local communities by enabling easy access to tools.
            We believe that by sharing resources, we can help reduce waste, lower costs, and create a more connected neighborhood.
          </p>
        </section>

        {/* Benefits Section - Modified with Cards */}
        <section className="mb-5">
          <h2>Why Use ToolNet?</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card text-center" style={{ backgroundColor: '#e0f2f1', border: 'none' }}>
                <div className="card-body">
                  <h5 className="card-title" style={{ color: '#00796b' }}>Save Money</h5>
                  <p className="card-text">
                    Borrow rather than buy, and save money on tools you may only need once.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card text-center" style={{ backgroundColor: '#e0f2f1', border: 'none' }}>
                <div className="card-body">
                  <h5 className="card-title" style={{ color: '#00796b' }}>Build Community</h5>
                  <p className="card-text">
                    Connect with neighbors, foster trust, and create a sense of belonging.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card text-center" style={{ backgroundColor: '#e0f2f1', border: 'none' }}>
                <div className="card-body">
                  <h5 className="card-title" style={{ color: '#00796b' }}>Reduce Waste</h5>
                  <p className="card-text">
                    Minimize environmental impact by reducing the demand for new tools and encouraging reuse.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Modified with Steps */}
        <section className="mb-5">
          <h2>How ToolNet Works</h2>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card" style={{ border: 'none' }}>
                <div className="card-body">
                  <h5 className="card-title" style={{ color: '#00796b' }}>Step 1: Join ToolNet</h5>
                  <p className="card-text">
                    Sign up to become part of your local ToolNet community.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card" style={{ border: 'none' }}>
                <div className="card-body">
                  <h5 className="card-title" style={{ color: '#00796b' }}>Step 2: Browse Tools</h5>
                  <p className="card-text">
                    View a variety of tools available for borrowing in your neighborhood.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card" style={{ border: 'none' }}>
                <div className="card-body">
                  <h5 className="card-title" style={{ color: '#00796b' }}>Step 3: Request or Offer Tools</h5>
                  <p className="card-text">
                    Request to borrow tools or list tools you’re willing to lend.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card" style={{ border: 'none' }}>
                <div className="card-body">
                  <h5 className="card-title" style={{ color: '#00796b' }}>Step 4: Connect & Exchange</h5>
                  <p className="card-text">
                    Coordinate with your neighbor to pick up and return the tool.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-5">
          <h2 style={{ color: '#00796b' }}>Join Us Today!</h2>
          <p>Become a part of ToolNet and start sharing resources, building community, and saving money!</p>
          <a href="/createuser" className="btn btn-primary" style={{ backgroundColor: '#00796b', borderColor: '#00796b' }}>
            Sign Up
          </a>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;
