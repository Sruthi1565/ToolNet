import React from 'react';
import { Link } from 'react-router-dom';

const benefits = [
  {
    title: 'Save money',
    copy: 'Borrow tools for short projects instead of buying items you may only need once.',
  },
  {
    title: 'Build trust',
    copy: 'Connect with neighbors through practical, repeatable exchanges around shared resources.',
  },
  {
    title: 'Reduce waste',
    copy: 'Keep useful tools in circulation and lower demand for new, rarely used equipment.',
  },
];

const steps = [
  'Create a ToolNet account with your local address.',
  'Browse tools listed around your neighborhood.',
  'Add tools to your rental cart and choose rental days.',
  'Coordinate pickup, delivery, and return with the owner.',
];

const AboutUs = () => {
  return (
    <main className="page">
      <section className="page-header">
        <p className="eyebrow">About ToolNet</p>
        <h1 className="page-title">A practical tool-sharing network for neighborhoods.</h1>
        <p className="page-copy">
          ToolNet helps people lend, rent, and discover tools close to home so everyday projects become easier and less wasteful.
        </p>
      </section>

      <section className="content-band about-section">
        <div>
          <h2 className="section-title">What ToolNet does</h2>
          <p className="about-copy">
            ToolNet is a community-driven platform for borrowing and lending tools locally. It keeps equipment useful, reduces duplicate purchases, and makes DIY work more accessible.
          </p>
        </div>

        <div>
          <h2 className="section-title">Why use it</h2>
          <div className="metric-grid">
            {benefits.map((benefit) => (
              <article className="panel-card" key={benefit.title}>
                <div className="panel-card__body">
                  <h3 className="section-title">{benefit.title}</h3>
                  <p className="text-muted mb-0">{benefit.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h2 className="section-title">How it works</h2>
          <div className="metric-grid">
            {steps.map((step, index) => (
              <article className="panel-card" key={step}>
                <div className="panel-card__body">
                  <span className="badge-soft">Step {index + 1}</span>
                  <p className="mt-3 mb-0 text-muted">{step}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="empty-state">
          <h2>Ready to share smarter?</h2>
          <p className="mb-3">Create an account and start browsing nearby tools.</p>
          <Link to="/createuser" className="btn btn-primary">Sign up</Link>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
