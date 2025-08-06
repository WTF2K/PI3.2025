import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PropostasEmpresa({ iduser }) {
  const [propostas, setPropostas] = useState([]);
  const [nova, setNova] = useState({ titulo: '', descricao: '' });

  useEffect(() => {
    carregarPropostas();
  }, []);

  const carregarPropostas = async () => {
    try {
      const res = await axios.get(`/api/propostas/empresa/${iduser}`);
      setPropostas(res.data);
    } catch (err) {
      console.error('Erro ao buscar propostas', err);
    }
  };

  const submeterProposta = async () => {
    try {
      await axios.post('/api/propostas', { ...nova, iduser });
      setNova({ titulo: '', descricao: '' });
      carregarPropostas();
    } catch (err) {
      console.error('Erro ao criar proposta', err);
    }
  };

  const atualizarProposta = async (id, dados) => {
    try {
      await axios.put(`/api/propostas/${id}`, dados);
      carregarPropostas();
    } catch (err) {
      console.error('Erro ao atualizar proposta', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Submeter nova proposta</h2>
      <input
        type="text"
        placeholder="Título"
        value={nova.titulo}
        onChange={(e) => setNova({ ...nova, titulo: e.target.value })}
        className="border p-2 mr-2"
      />
      <input
        type="text"
        placeholder="Descrição"
        value={nova.descricao}
        onChange={(e) => setNova({ ...nova, descricao: e.target.value })}
        className="border p-2 mr-2"
      />
      <button onClick={submeterProposta} className="bg-blue-500 text-white px-4 py-2 rounded">
        Submeter
      </button>

      <h2 className="text-xl font-bold my-4">Minhas propostas</h2>
      <ul>
        {propostas.map((p) => (
          <li key={p.idproposta} className="border p-3 my-2">
            <h3 className="font-semibold">{p.titulo}</h3>
            <p>{p.descricao}</p>
            <p>Status: {p.ativa ? 'Ativa' : 'Inativa'} | {p.atribuida ? 'Atribuída' : 'Disponível'}</p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => atualizarProposta(p.idproposta, { ativa: false })}
                className="bg-red-500 text-white px-2 py-1 rounded"
                disabled={p.atribuida}
              >
                Desativar
              </button>
              <button
                onClick={() => atualizarProposta(p.idproposta, { ativa: true })}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Tornar Disponível
              </button>
              <button
                onClick={() => {
                  const novoTitulo = prompt('Novo título', p.titulo);
                  const novaDesc = prompt('Nova descrição', p.descricao);
                  if (novoTitulo && novaDesc)
                    atualizarProposta(p.idproposta, { titulo: novoTitulo, descricao: novaDesc });
                }}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Editar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
