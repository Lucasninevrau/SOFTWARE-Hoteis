'use client'

import { Carousel } from "react-bootstrap";

export default function BannerHome() {
    const banners = ["banner-01", "banner-02", "banner-03", "banner-04", ];

    return (
        <Carousel>
            {banners.map((banner, index) => (
                <Carousel.Item key={index}>
                    <img
                        style={{
                            width: "100%",
                            height: "500px" 
                        }}
                        className="d-block"
                        src={`/images/${banner}.png`} // Corrigido para usar template literals
                        alt={`Slide ${index + 1}`} // Adicionando alt para acessibilidade
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    );
}
