import React from 'react';
import NadaHelmet from '../components/NadaHelmet';

const ShippingPolicy = () => {
  return (
    <div>
      <NadaHelmet
        sections={['Shipping Policy']}
        description="Learn about Nada Art's shipping methods, delivery times, packaging standards, and international shipping policies for artwork purchases and safe delivery."
        keywords="nada art shipping, artwork delivery, art shipping policy, international art shipping, framing delivery, art packaging, shipping costs, delivery timeline, art care during shipping, insured art delivery"
      />
      <div>
        <div className="flex flex-col gap-2 justify-center">
          <p className="text-3xl text-center font-medium">Shipping Policy</p>
          <p className="text-xl text-center font-light">
            How we deliver your artwork safely and efficiently
          </p>
        </div>
      </div>

      <div className="mt-8 max-w-3xl mx-auto">
        <div>
          <div>
            <p className="text-2xl font-medium text-center">
              Shipping Information
            </p>
            <p className="text-sm font-light italic text-center">
              Last Updated: January 1, 2023
            </p>

            <p className="mt-5 max-w-2xl mx-auto mb-5">
              At Art Gallery, we take great care in packaging and shipping your
              artwork to ensure it arrives in perfect condition. This policy
              outlines our shipping procedures, timelines, and what you can
              expect when ordering from us.
            </p>

            <p className="font-semibold  mb-2 relative after:absolute after:bottom-2.5  after:h-2  after:-left-4 after:top-[6px] after:border-t-5 after:border-t-transparent after:border-b-5 after:border-b-transparent after:border-l-8 after:border-l-[#501414]">
              Processing Time
            </p>
            <p className="mb-2">
              All orders are processed within 2-5 business days (excluding
              weekends and holidays) after receiving your order confirmation
              email. You will receive another notification when your order has
              shipped.
            </p>
            <ul className="list-disc pl-10">
              <li>
                <span className="font-semibold">Original Artworks:</span>{' '}
                Require special packaging preparation and typically ship within
                3-5 business days
              </li>
              <li>
                <strong>Prints & Reproductions:</strong> Usually ship within 2-3
                business days
              </li>
              <li>
                <strong>Custom Commissions:</strong> Shipping timelines vary
                based on completion date (specified at time of commission)
              </li>
            </ul>

            <p className="font-semibold mt-6  mb-2 relative after:absolute after:bottom-2.5  after:h-2  after:-left-4 after:top-[6px] after:border-t-5 after:border-t-transparent after:border-b-5 after:border-b-transparent after:border-l-8 after:border-l-[#501414]">
              Domestic Shipping
            </p>
            <p>We ship throughout the United States using trusted carriers:</p>
            <ul className="list-disc pl-10">
              <li>Standard Shipping: 5-7 business days ($12 flat rate)</li>
              <li>Express Shipping: 2-3 business days ($25 flat rate)</li>
              <li>
                White Glove Delivery: Available for large pieces (quoted
                individually)
              </li>
              <li>Free standard shipping on orders over $300</li>
            </ul>

            <p className="font-semibold mt-6  mb-1 relative after:absolute after:bottom-2.5  after:h-2  after:-left-4 after:top-[6px] after:border-t-5 after:border-t-transparent after:border-b-5 after:border-b-transparent after:border-l-8 after:border-l-[#501414]">
              International Shipping
            </p>
            <p>We ship to select countries internationally. Please note:</p>
            <ul className="list-disc pl-10">
              <li>
                Shipping costs vary by destination (calculated at checkout)
              </li>
              <li>Delivery times: 10-21 business days depending on location</li>
              <li>
                Customers are responsible for any customs fees, taxes, or import
                duties
              </li>
              <li>
                International shipments may require additional processing time
              </li>
            </ul>

            <p className="font-semibold mt-6  mb-1 relative after:absolute after:bottom-2.5  after:h-2  after:-left-4 after:top-[6px] after:border-t-5 after:border-t-transparent after:border-b-5 after:border-b-transparent after:border-l-8 after:border-l-[#501414]">
              Packaging Methods
            </p>
            <p>
              We take extreme care in packaging your artwork to prevent damage
              during transit:
            </p>
            <ul className="list-disc pl-10">
              <li>
                Canvas paintings: Corner protectors, bubble wrap, and custom
                boxes
              </li>
              <li>
                Framed works: Glass protection, cardboard corners, and
                double-boxing
              </li>
              <li>
                Prints: Acid-free tissue, rigid mailers, and "Do Not Bend"
                labels
              </li>
              <li>Sculptures: Custom foam cushioning and reinforced boxes</li>
            </ul>

            <p className="font-semibold mt-6  mb-1 relative after:absolute after:bottom-2.5  after:h-2  after:-left-4 after:top-[6px] after:border-t-5 after:border-t-transparent after:border-b-5 after:border-b-transparent after:border-l-8 after:border-l-[#501414]">
              Tracking Your Order
            </p>
            <p>
              Once your order ships, you will receive an email with a tracking
              number and carrier information. You can use this tracking number
              to monitor your shipment's progress.
            </p>

            <p className="font-semibold mt-6  mb-1 relative after:absolute after:bottom-2.5  after:h-2  after:-left-4 after:top-[6px] after:border-t-5 after:border-t-transparent after:border-b-5 after:border-b-transparent after:border-l-8 after:border-l-[#501414]">
              Delivery Issues
            </p>
            <p>If you experience any issues with delivery:</p>
            <ul className="list-disc pl-10">
              <li>
                Contact us immediately if your package appears damaged upon
                delivery
              </li>
              <li>Refuse delivery if the packaging is severely compromised</li>
              <li>
                Report lost packages to us within 14 days of expected delivery
              </li>
              <li>
                We will work with the carrier to resolve any shipping issues
              </li>
            </ul>

            <p className="font-semibold mt-6  mb-1 relative after:absolute after:bottom-2.5  after:h-2  after:-left-4 after:top-[6px] after:border-t-5 after:border-t-transparent after:border-b-5 after:border-b-transparent after:border-l-8 after:border-l-[#501414]">
              Special Instructions
            </p>
            <p>
              For special delivery instructions or specific delivery date
              requests, please contact us before placing your order. While we
              cannot guarantee specific delivery dates, we will do our best to
              accommodate your needs.
            </p>

            <div>
              <p className="font-semibold mt-6  mb-1 relative after:absolute after:bottom-2.5  after:h-2  after:-left-4 after:top-[6px] after:border-t-5 after:border-t-transparent after:border-b-5 after:border-b-transparent after:border-l-8 after:border-l-[#501414]">
                Contact Us
              </p>
              <p>
                If you have any questions about our shipping policy or need
                assistance with an order, please contact us at:
              </p>
              <p>
                Email: shipping@artgallery.com
                <br />
                Phone: (555) 123-SHIP
                <br />
                Hours: Monday-Friday, 9am-5pm EST
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="bg-gray-50 p-5 rounded-lg">
            <p className="font-semibold text-center mb-3">Important Notes</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Shipping times are estimates and not guarantees</li>
              <li>Extreme weather conditions may delay shipments</li>
              <li>We are not responsible for delays caused by carriers</li>
              <li>Signature may be required for high-value shipments</li>
              <li>Please inspect your artwork upon delivery</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <div className="mt-12 flex flex-col justify-center">
          <p className="text-center">
            © 2023 Art Gallery. All rights reserved.
          </p>
          <p className="text-center">
            123 Artisan Street, Creative City, AR 12345 | (555) 123-4567 |
            info@artgallery.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
