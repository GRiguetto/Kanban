// ARQUIVOS DO ANGULAR E OUTRAS BIBLIOTECAS QUE VOCÊ JÁ USAVA
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api';

interface Card {
  id: number;
  title: string;
  badge: 'low' | 'medium' | 'high';  
  badgeText: string;
}

interface Column {
  id: string;
  title:string;
  cards: Card[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DragDropModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  columns: Column[] = [
    { id: '1', title: 'A Fazer', cards: [] },
    { id: '2', title: 'Em Andamento', cards: [] },
    { id: '3', title: 'Concluído', cards: [] },
  ];
  
  isModalVisible = false;
  currentColumnId: string | null = null;
  addCardForm: FormGroup;

  isAddColumnModalVisible = false;
  addColumnForm: FormGroup;

  isDeleteColumnModalVisible = false;
  columnIndexToDelete: number | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    // A lógica de criação de formulários permanece a mesma.
    this.addCardForm = this.fb.group({
      title: ['', Validators.required],
      badge: ['low', Validators.required] // Manteremos isso por enquanto, mas não será enviado ao backend.
    });
    
    this.addColumnForm = this.fb.group({
      title: ['', Validators.required]
    });
  }
  // =========================================================================================

  // =========================================================================================
  // NOVO MÉTODO (PARTE DO OnInit):
  // Este método é chamado automaticamente assim que o componente é exibido na tela.
  ngOnInit() {
    this.loadInitialData();
  }

  // NOVO MÉTODO:
  // Centraliza a busca inicial de dados.
  loadInitialData() {
    this.columns.forEach(column => {
      // A interface Card do backend só tem 'badge', não 'badgeText'.
      // Então, o tipo que esperamos do backend é um pouco diferente.
      this.apiService.getCards(parseInt(column.id)).subscribe((cardsDoBackend: {id: number, title: string, badge: 'low' | 'medium' | 'high'}[]) => {
        console.log(`Cards recebidos para a coluna ${column.id}:`, cardsDoBackend);

        const badgeTextMap = {
          low: 'Prioridade mínima',
          medium: 'Prioridade média',
          high: 'Prioridade máxima'
        };

        // Convertemos os cards do backend para o formato do frontend, adicionando o badgeText
        column.cards = cardsDoBackend.map(card => ({
          ...card, // Copia id, title, badge
          badgeText: badgeTextMap[card.badge] // Adiciona o badgeText
        }));
      });
    });
}
  // =========================================================================================

  // NENHUMA MUDANÇA na lógica de Drag and Drop
  drop(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // 1. Pegamos a string completa do ID gerado pelo CDK, ex: "cdk-drop-list-1"
      const containerId = event.container.id;

      // 2. Extraímos o índice do final da string. ex: "1"
      const extractedIndexString = containerId.split('-').pop();

      if (!extractedIndexString) {
        console.error('ERRO: Não foi possível extrair o índice do container:', containerId);
        return;
      }
      
      // 3. Convertemos o índice para número e SOMAMOS 1 para obter nosso ID real.
      const extractedIndex = parseInt(extractedIndexString, 10);
      const newColumnId = extractedIndex + 1; // <<< A CORREÇÃO ESTÁ AQUI!

      const movedCard = event.previousContainer.data[event.previousIndex];

      // 4. Chamamos a API com o ID da coluna CORRETO.
      this.apiService.updateCard(movedCard.id, { columnId: newColumnId }).subscribe({
        next: (updatedCard) => {
          console.log(`SUCESSO: Card ${updatedCard.id} movido para a coluna ${updatedCard.columnId} no backend.`);
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex,
          );
        },
        error: (err) => {
          console.error('ERRO: Falha ao atualizar a coluna do card no backend:', err);
          alert('Não foi possível mover o card. A página será recarregada.');
          window.location.reload();
        }
      });
    }
  }
  // NENHUMA MUDANÇA na abertura e fechamento dos modais
  openAddCardModal(columnId: string) {
    this.isModalVisible = true;
    this.currentColumnId = columnId;
  }

  closeModal() {
    this.isModalVisible = false;
    this.currentColumnId = null;
    this.addCardForm.reset({ badge: 'low' });
  }

  // =========================================================================================
  
  
  // MÉTODO onAddCard TOTALMENTE REESCRITO


  onAddCard() {
    if (this.addCardForm.valid && this.currentColumnId) {

      // 👇 ATUALIZAÇÃO: AGORA ENVIAMOS O 'badge' DO FORMULÁRIO
      const dadosParaApi = {
        title: this.addCardForm.value.title,
        badge: this.addCardForm.value.badge, // Pegamos o valor do 'badge' do formulário
        columnId: parseInt(this.currentColumnId)
      };

      this.apiService.createCard(dadosParaApi).subscribe((cardCriadoNoBackend: Card) => {
        console.log('Backend respondeu, card criado:', cardCriadoNoBackend);
        const column = this.columns.find(c => c.id === this.currentColumnId);
        if (column) {
          // Recriamos o badgeText para o novo card antes de exibi-lo
          const badgeTextMap = { low: 'Prioridade mínima', medium: 'Prioridade média', high: 'Prioridade máxima' };
          const cardCompleto = {
              ...cardCriadoNoBackend,
              badgeText: badgeTextMap[cardCriadoNoBackend.badge]
          };
          column.cards.push(cardCompleto);
        }
        this.closeModal();
      });
    }
}
  // POR QUE MUDOU?
  // A versão antiga criava um card "fake" e o adicionava diretamente na lista local.
  // Esta nova versão envia os dados para o backend, espera a confirmação de que foi
  // criado com sucesso e só então adiciona o card *real* (com a ID e tudo mais que
  // o backend retornou) à lista da tela. É o fluxo correto de uma aplicação real.
  // =========================================================================================

  // O restante dos seus métodos para gerenciar colunas não foi alterado.
  // Eles continuarão funcionando localmente por enquanto.

  deleteCard(columnId: string, cardIndex: number) {
    // 1. Encontramos a coluna correta onde o card está.
    const column = this.columns.find(c => c.id === columnId);

    if (column && column.cards[cardIndex]) {
      // 2. Pegamos a ID do card que será excluído para enviar ao backend.
      const cardIdToDelete = column.cards[cardIndex].id;

      // 3. Chamamos o ApiService para deletar o card no backend.
      this.apiService.deleteCard(cardIdToDelete).subscribe({
        next: () => {
          // 4. SUCESSO! O backend confirmou a exclusão.
          console.log(`Card com ID ${cardIdToDelete} excluído com sucesso no backend.`);

          // 5. Agora, e somente agora, removemos o card da lista local para atualizar a tela.
          column.cards.splice(cardIndex, 1);
        },
        error: (err) => {
          // 6. Lidamos com um possível erro de comunicação com o backend.
          console.error('Erro ao excluir o card:', err);
          alert('Não foi possível excluir o card. Tente novamente.');
        }
      });
    }
  }
  
  openAddColumnModal() {
    this.isAddColumnModalVisible = true;
  }
  
  closeAddColumnModal() {
    this.isAddColumnModalVisible = false;
    this.addColumnForm.reset();
  }
  
  onAddColumn() {
    if (this.addColumnForm.valid) {
      const newColumn: Column = {
        id: (this.columns.length + 1).toString(),
        title: this.addColumnForm.value.title,
        cards: []
      };
      this.columns.push(newColumn);
      this.closeAddColumnModal();
    }
  }

  openDeleteColumnModal(columnIndex: number) {
    this.columnIndexToDelete = columnIndex;
    this.isDeleteColumnModalVisible = true;
  }

  closeDeleteColumnModal() {
    this.isDeleteColumnModalVisible = false;
    this.columnIndexToDelete = null;
  }

  confirmDeleteColumn() {
    if (this.columnIndexToDelete !== null) {
      this.columns.splice(this.columnIndexToDelete, 1);
      this.closeDeleteColumnModal();
    }
  }
}