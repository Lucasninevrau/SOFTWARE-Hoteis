'use client'

import { Card, Col, Row } from "react-bootstrap";
import Pagina from "./components/Pagina";
import Link from "next/link";

export default function Home() {

  const produtos = [
    { id: 1, nome: 'Camisa Vasco Masculina', valor: '290.99', valorOriginal: '390.99', url: 'https://static.netshoes.com.br/produtos/camisa-vasco-i-2425-jogador-kappa-masculina/26/D24-6176-026/D24-6176-026_zoom1.jpg?ts=1713200261?ims=1088x' },
    { id: 2, nome: 'Camisa Flamengo Feminina - Vermelho+Preto', valor: '339.49', valorOriginal: '439.49', url: 'https://static.netshoes.com.br/produtos/camisa-flamengo-i-2425-sn-torcedor-adidas-feminina/68/FB9-4228-068/FB9-4228-068_zoom1.jpg?ts=1706693107?ims=1088x' },
    { id: 3, nome: 'Camisa São Paulo Masculina - Laranja', valor: '199.99', valorOriginal: '299.99', url: 'https://static.netshoes.com.br/produtos/camisa-sao-paulo-2425-sn-treino-new-balance-masculina/42/39U-9331-042/39U-9331-042_zoom1.jpg?ts=1705670015?ims=1088x' },
    { id: 4, nome: 'Camisa Fluminense Masculina - Verde+Rosa', valor: '239.99', valorOriginal: '339.99', url: 'https://static.netshoes.com.br/produtos/camisa-fluminense-iii-2324-sn-torcedor-umbro-masculina/15/2IA-7608-815/2IA-7608-815_zoom1.jpg?ts=1697200429?ims=1088x' },
    { id: 5, nome: 'Camisa Flamengo Masculina - Vermelho+Preto', valor: '279.99', valorOriginal: '379.99', url: 'https://static.netshoes.com.br/produtos/camisa-flamengo-i-2324-sn-torcedor-adidas-masculina/68/FB8-4631-068/FB8-4631-068_zoom1.jpg?ts=1701710213?ims=1088x' },
    { id: 6, nome: 'Chuteira Futsal Nike Beco 2 Unissex - Preto', valor: '227.99', valorOriginal: '327.99', url: 'https://static.netshoes.com.br/produtos/chuteira-futsal-nike-beco-2-unissex/72/HZM-0953-172/HZM-0953-172_zoom2.jpg?ts=1707400466?ims=1088x' },
    { id: 7, nome: 'Chuteira Society Umbro Neo Striker - Azul Royal+Branco', valor: '149.99', valorOriginal: '199.99', url: 'https://static.netshoes.com.br/produtos/chuteira-society-umbro-neo-striker/43/2IA-0489-543/2IA-0489-543_zoom2.jpg?ts=1710411616?ims=1088x' }
  ];

  return (
    <Pagina showBanner={true}>
      <Row>
        {produtos.map(item => (
          <Col className="mb-5" key={item.id}>
            <Link href={`/produto/${item.id}`} style={{ textDecoration: 'none' }}>
              <Card style={{ width: '20rem' }}>
                <Card.Img variant="top" src={item.url} />
                <Card.Body style={{ minHeight: "230px" }}>
                  <Card.Title className="mt-2">{item.nome}</Card.Title>
                  <Card.Text style={{ textDecoration: 'line-through', color: '#888' }}>R$: {item.valorOriginal}</Card.Text>
                  <Card.Text style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>R$: {item.valor}</Card.Text>
                  <Card.Text>ou 3x de R$: {(item.valor / 3).toFixed(2)}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Pagina>

  )
}