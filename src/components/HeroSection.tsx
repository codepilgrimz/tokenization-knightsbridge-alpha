
import React from 'react';

export const HeroSection: React.FC = () => {
	return (
		<section className="w-full flex justify-center pt-[150px] md:pt-[200px] lg:pt-[225px] pb-[80px] md:pb-[108px] px-4">
			<div className="max-w-6xl mx-auto text-center">
				{/* <div className="flex justify-center mb-8">
          <img
            src="/path/to/your/icon.png"
            alt="Hero Icon"
            className="w-20 h-20 md:w-24 md:h-24"
          />
        </div> */}
				<h1 className="text-text-primary text-center text-3xl md:text-5xl lg:text-[75px] font-normal mb-8 md:mb-11 leading-tight">
					Launch via Decentralized Path
				</h1>
				<p className="text-text-primary text-center text-base md:text-lg lg:text-[19px] font-normal max-w-[593px] mx-auto">
					Select the services you need, enter your token details, and build
					your launch — all on your terms.
				</p>
			</div>
		</section>
	);
};
