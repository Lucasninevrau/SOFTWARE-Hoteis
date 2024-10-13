'use client';

import { Card, Col, Row } from "react-bootstrap";
import Pagina from "./components/Pagina";
import Link from "next/link";
import { useEffect, useState } from "react";

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
        {produtos.map(item => { // Verifique o ID do produto aqui
          return (
            <Col className="mb-5" key={item.id}>
              <Link href={`/produto/${item.id}`} style={{ textDecoration: 'none' }}>
                <Card style={{ width: '20rem' }}>
                  <Card.Img variant="top" src={item.urlPrincipal} /> {/* Verifique a propriedade correta aqui */}
                  <Card.Body style={{ minHeight: "230px" }}>
                    <Card.Title className="mt-2">{item.nome}</Card.Title>
                    <Card.Text style={{ textDecoration: 'line-through', color: '#888' }}>R$: {item.valorOriginal}</Card.Text>
                    <Card.Text style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>R$: {item.valor}</Card.Text>
                    <Card.Text>ou 3x de R$: {(item.valor / 3).toFixed(2)}</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          );
        })}
      </Row>
    </Pagina>
  );
}
