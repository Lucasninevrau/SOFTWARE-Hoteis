'use client';

import Pagina from "@/app/components/Pagina";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Carousel, Col, Form, Image, Row, Alert } from "react-bootstrap";
import { BsHeart, BsHeartFill } from "react-icons/bs";

export default function Page() {
  const [produto, setProduto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [tamanhos, setTamanhos] = useState([]);
  const [listaDesejos, setListaDesejos] = useState([]); // Estado para a lista de desejos
  const [mensagem, setMensagem] = useState(''); // Estado para a mensagem de sucesso
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produtoEncontrado = produtos.find(produto => produto.id === parseInt(id));

    if (produtoEncontrado) {
      setProduto(produtoEncontrado);
      setTamanhoSelecionado(produtoEncontrado.tamanho || '');
    } else {
      router.push('/');
    }

    const tamanhosSalvos = JSON.parse(localStorage.getItem('tamanhos')) || [];
    setTamanhos(tamanhosSalvos);

    const desejosSalvos = JSON.parse(localStorage.getItem('listaDesejos')) || [];
    setListaDesejos(desejosSalvos);
  }, [id, router]);

  const handleSelect = (selectedIndex) => {
    setSelectedIndex(selectedIndex);
  };

  const adicionarAoCarrinho = () => {
    const produtoCarrinho = {
      ...produto,
      tamanho: tamanhoSelecionado,
      quantidade: quantidade
    };

    const carrinhoExistente = JSON.parse(localStorage.getItem('carrinho')) || [];
    const produtoExistente = carrinhoExistente.find(item =>
      item.id === produtoCarrinho.id &&
      item.tamanho === produtoCarrinho.tamanho &&
      item.nome === produtoCarrinho.nome
    );

    if (produtoExistente) {
      produtoExistente.quantidade += quantidade;
    } else {
      carrinhoExistente.push(produtoCarrinho);
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinhoExistente));
    router.push('/carrinho');
  };

  const handleDesejoClick = () => {
    let novaListaDesejos = [...listaDesejos];
    const jaNaLista = listaDesejos.some(item => item.id === produto.id);

    if (jaNaLista) {
      novaListaDesejos = novaListaDesejos.filter(item => item.id !== produto.id);
      setMensagem('Item removido da lista de desejos.');
    } else {
      novaListaDesejos.push(produto);
      setMensagem('Item adicionado à lista de desejos!');
    }

    setListaDesejos(novaListaDesejos);
    localStorage.setItem('listaDesejos', JSON.stringify(novaListaDesejos));

    // Remover a mensagem após 3 segundos
    setTimeout(() => {
      setMensagem('');
    }, 3000);
  };

  const estaNaListaDesejos = listaDesejos.some(item => item.id === produto?.id);

  if (!produto) {
    return <div>Carregando...</div>;
  }

  const imagens = [produto.urlPrincipal, ...produto.imagensAdicionais];

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
          <p>ou 3x de R$: {(parseFloat(produto.valor.replace(',', '.')) / 3).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('.', ',')}</p>



          {/* Mensagem de confirmação */}
          {mensagem && <Alert variant="success">{mensagem}</Alert>}

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

          {estaNaListaDesejos ? (
            <BsHeartFill
              className="heart-icon w-100 mb-3 mt-4"
              size={25}
              onClick={handleDesejoClick}
              style={{
                color: 'red',
                cursor: 'pointer',
              }}
            />
          ) : (
            <BsHeart
              className="heart-icon w-100 mb-3 mt-4"
              size={25}
              onClick={handleDesejoClick}
              style={{
                color: '#000',
                cursor: 'pointer',
              }}
            />
          )}
        </Col>
      </Row>
    </Pagina>
  );
}
