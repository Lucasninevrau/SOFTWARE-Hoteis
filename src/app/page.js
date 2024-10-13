'use client';

import { Card, Col, Row } from "react-bootstrap";
import Pagina from "./components/Pagina";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from './home.module.css';


export default function Home() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    // Carrega os produtos do localStorage
    const produtosCadastrados = JSON.parse(localStorage.getItem('produtos')) || [];
    console.log(produtosCadastrados); // Verifica se os produtos estão sendo carregados corretamente
    setProdutos(produtosCadastrados);
  }, []);

  return (
    <Pagina showBanner={true}>
      <Row>
        {produtos.map(item => (
          <Col 
            key={item.id} 
            xs={12}    // 1 produto por linha em telas xs
            sm={6}     // 2 produtos por linha em telas sm
            md={4}     // 3 produtos por linha em telas md
            lg={3}     // 4 produtos por linha em telas lg
            className="mb-5"
          >
            <Link href={`/produto/${item.id}`} style={{ textDecoration: 'none' }}>
              <Card className={`h-100 ${styles.cardHover}`}>  {/* Adiciona a classe h-100 para altura 100% */}
                <Card.Img variant="top" src={item.urlPrincipal} />
                <Card.Body className="d-flex flex-column justify-content-between" style={{ minHeight: "230px" }}>
                  <div>
                    <Card.Title className="mt-2">{item.nome}</Card.Title>
                    <Card.Text style={{ textDecoration: 'line-through', color: '#888' }}>
                      R$: {item.valorOriginal}
                    </Card.Text>
                    <Card.Text style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                      R$: {item.valor}
                    </Card.Text>
                  </div>
                  <div>
                    <Card.Text>
                      ou 3x de R$: {(item.valor / 3).toFixed(2)}
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Pagina>
  );
  
  
}
