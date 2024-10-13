'use client';

import Pagina from "@/app/components/Pagina";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; 
import { Button, Carousel, Col, Form, Image, Row } from "react-bootstrap";
import { BsHeart } from "react-icons/bs";

export default function Page() {
  const [produto, setProduto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [tamanhos, setTamanhos] = useState([]); // Estado para tamanhos
  const router = useRouter();
  const { id } = useParams(); 

  useEffect(() => {
    // Carregar produto do localStorage com base no ID
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produtoEncontrado = produtos.find(produto => produto.id === parseInt(id));

    if (produtoEncontrado) {
      setProduto(produtoEncontrado);
      setTamanhoSelecionado(produtoEncontrado.tamanho || ''); // Define o tamanho selecionado com base no produto, se existir
    } else {
      // Redireciona para a página inicial se o produto não for encontrado
      router.push('/');
    }

    // Carregar tamanhos do localStorage
    const tamanhosSalvos = JSON.parse(localStorage.getItem('tamanhos')) || [];
    setTamanhos(tamanhosSalvos);
  }, [id, router]);

  const handleSelect = (selectedIndex) => {
    setSelectedIndex(selectedIndex);
  };

  const adicionarAoCarrinho = () => {
    // Monta o objeto do produto para adicionar ao carrinho
    const produtoCarrinho = {
      ...produto,
      tamanho: tamanhoSelecionado, // Adiciona o tamanho selecionado
      quantidade: quantidade // Adiciona a quantidade selecionada
    };

    // Obtém o carrinho existente do localStorage ou inicia um novo array
    const carrinhoExistente = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Verifica se o produto já existe no carrinho
    const produtoExistente = carrinhoExistente.find(item => 
        item.id === produtoCarrinho.id &&
        item.tamanho === produtoCarrinho.tamanho &&
        item.nome === produtoCarrinho.nome
    );

    if (produtoExistente) {
        // Se o produto já existe, apenas aumenta a quantidade
        produtoExistente.quantidade += quantidade; // Acumula a quantidade
    } else {
        // Se o produto não existe, adiciona ao carrinho
        carrinhoExistente.push(produtoCarrinho);
    }

    // Atualiza o localStorage com o novo carrinho
    localStorage.setItem('carrinho', JSON.stringify(carrinhoExistente));

    console.log(`Produto adicionado ao carrinho:`, produtoCarrinho);
    router.push('/carrinho');
};


  if (!produto) {
    return <div>Carregando...</div>;
  }

  // Verifique se as imagens estão corretamente referenciadas
  const imagens = [produto.urlPrincipal, ...produto.imagensAdicionais]; // Acessando a imagem principal e as adicionais

  return (
    <Pagina>
      <Row>
        <Col md={8}>
          <Row className="justify-content-end align-items-center">
            <Col md={2}>
              <Row className="flex-column">
                {imagens.map((src, idx) => (
                  <Col key={idx} onClick={() => handleSelect(idx)} className="mb-2">
                    <Image
                      src={src}
                      alt={`Imagem ${idx + 1}`}
                      thumbnail
                      style={{
                        cursor: 'pointer',
                        border: idx === selectedIndex ? '2px solid #007bff' : 'none',
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </Col>
            <Col md={8}>
              <Row className="mb-3">
                <Col md={12}>
                  <Carousel className="w-100" activeIndex={selectedIndex} onSelect={handleSelect} indicators={false}>
                    {imagens.map((src, idx) => (
                      <Carousel.Item key={idx}>
                        <Image src={src} alt={`Imagem ${idx + 1}`} className="d-block w-100" />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col md={4}>
          <h1>{produto.nome}</h1>
          <p style={{ margin: 0, color: '#888' }}>A partir de</p>
          <p style={{ marginTop: '1px', fontWeight: 'bold', fontSize: '2rem' }}>R$: {produto.valor}</p>
          <p>ou 3x de R$: {(produto.valor / 3).toFixed(2)}</p>

          {/* Escolher Tamanho */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>Tamanho</Form.Label>
            <Col sm={9}>
              <Form.Control
                as="select"
                value={tamanhoSelecionado}
                onChange={(e) => setTamanhoSelecionado(e.target.value)}
              >
                <option value="">Selecione um tamanho</option>
                {tamanhos.map(tamanho => (
                  <option key={tamanho.id} value={tamanho.tamanho}>{tamanho.tamanho}</option>
                ))}
              </Form.Control>
            </Col>
          </Form.Group>

          {/* Escolher Quantidade */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>Quantidade</Form.Label>
            <Col sm={9}>
              <Form.Control
                type="number"
                min={1}
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </Col>
          </Form.Group>

          <Button variant="success" className="w-100 mb-3" onClick={adicionarAoCarrinho}>Adicionar ao Carrinho</Button>
          <Button variant="secondary" className="w-100" onClick={() => router.push('/')}>Continuar Comprando</Button>
          <BsHeart
            className="heart-icon w-100 mb-3 mt-4"
            size={25}
            onClick={() => alert(':)')}
            style={{
              color: '#000',
              transition: 'color 0.5s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'red'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#000'}
          />
        </Col>
      </Row>
    </Pagina>
  );
}
