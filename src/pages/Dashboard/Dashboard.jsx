import React from "react";
import LoggedinLayout from "../../components/LoggedinLayout";
import poloAction from "../../assets/dashboard/polo_horse_action_1_1766430130895.png";
import poloPortrait from "../../assets/dashboard/polo_horse_portrait_1_1766430144356.png";
import poloMatch from "../../assets/dashboard/polo_match_wide_1_1766430159855.png";
import poloDetail from "../../assets/dashboard/polo_horse_detail_1_1766430176137.png";

const Dashboard = () => {
    const images = [
        { src: poloAction, alt: "Polo Action Shot" },
        { src: poloPortrait, alt: "Polo Horse Portrait" },
        { src: poloMatch, alt: "Polo Match Wide" },
        { src: poloDetail, alt: "Polo Horse Detail" },
    ];

    return (
        <LoggedinLayout>
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {images.map((img, index) => (
                        <div key={index} className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </LoggedinLayout>
    );
};

export default Dashboard;