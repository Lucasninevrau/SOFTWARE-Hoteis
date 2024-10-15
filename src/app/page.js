'use client';

import { Card, Col, Row, Button } from "react-bootstrap";
import Pagina from "./components/Pagina";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from './home.module.css';

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8); // Exibe 8 produtos inicialmente

  useEffect(() => {
    // Carrega os produtos do localStorage
    const produtosCadastrados = JSON.parse(localStorage.getItem('produtos')) || [];
    console.log(produtosCadastrados); // Verifica se os produtos estão sendo carregados corretamente
    setProdutos(produtosCadastrados);
  }, []);

  // Função para carregar mais produtos
  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 4); // Adiciona 4 produtos a cada clique
  };

  return (
    <Pagina showBanner={true}>
      <Row>
        {produtos.slice(0, visibleCount).map(item => (
          <Col
            key={item.id}
            xs={12}    // 1 produto por linha em telas xs
            sm={6}     // 2 produtos por linha em telas sm
            md={4}     // 3 produtos por linha em telas md
            lg={3}     // 4 produtos por linha em telas lg
            className="mb-5"
          >
            <Link href={`/produto/${item.id}`} style={{ textDecoration: 'none' }}>
              <Card className={`h-100 ${styles.cardHover}`}>
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
                      ou 3x de R$: {(parseFloat(item.valor.replace(',', '.')) / 3).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('.', ',')}
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {/* Botão "Ver mais" */}
      {visibleCount < produtos.length && ( // Verifica se há mais produtos para mostrar
        <div className="text-center">
          <Button variant="light" onClick={loadMore} style={{ opacity: 0.7 }}>
            Ver mais
          </Button>
        </div>
      )}
    </Pagina>
  );
}
