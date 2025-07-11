import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api';

// ✅ CORREÇÃO 1: APAGUE A LINHA ABAIXO E USE O "QUICK FIX" DO VS CODE
// Clique na palavra 'ApiService' no construtor e use a lâmpada para importar automaticamente.

// --- Interfaces ---
interface Card {
  columnId: any;
  id: number;
  title: string;
  badge: 'low' | 'medium' | 'high';
  badgeText: string;
}

interface Column {
  id: string;
  name: string;
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

  columns: Column[] = [];
  isModalVisible = false;
  currentColumnId: string | null = null;
  addCardForm: FormGroup;
  isAddColumnModalVisible = false;
  addColumnForm: FormGroup;
  isDeleteColumnModalVisible = false;
  columnIndexToDelete: number | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.addCardForm = this.fb.group({
      title: ['', Validators.required],
      badge: ['low', Validators.required]
    });
    this.addColumnForm = this.fb.group({
      title: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.apiService.getColumns(1).subscribe((columnsFromBackend: any[]) => {
      this.columns = columnsFromBackend.map(col => ({
        id: col.id.toString(),
        name: col.name,
        cards: []
      }));
      this.columns.forEach(column => {
        this.apiService.getCards(parseInt(column.id)).subscribe((cardsFromBackend: Card[]) => {
          const badgeTextMap = { low: 'Prioridade mínima', medium: 'Prioridade média', high: 'Prioridade máxima' };
          column.cards = cardsFromBackend.map(card => {
            const badgeType = card.badge as 'low' | 'medium' | 'high';
            return { ...card, badgeText: badgeTextMap[badgeType] };
          });
        });
      });
    });
  }

  onAddColumn() {
    if (this.addColumnForm.valid) {
      const columnData = { name: this.addColumnForm.value.title, boardId: 1 };
      // ✅ CORREÇÃO 2: Adicionamos o tipo para 'newColumnFromBackend'
      this.apiService.createColumn(columnData).subscribe((newColumnFromBackend: { id: number; name: string }) => {
        this.columns.push({
          id: newColumnFromBackend.id.toString(),
          name: newColumnFromBackend.name,
          cards: []
        });
        this.closeAddColumnModal();
      });
    }
  }

  confirmDeleteColumn() {
    if (this.columnIndexToDelete !== null) {
      const columnToDelete = this.columns[this.columnIndexToDelete];
      const columnId = parseInt(columnToDelete.id);
      this.apiService.deleteColumn(columnId).subscribe(() => {
        this.columns.splice(this.columnIndexToDelete!, 1);
        this.closeDeleteColumnModal();
      });
    }
  }

  drop(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const newColumnIdString = (event.container.element.nativeElement as HTMLElement).dataset['columnId'];

      if (!newColumnIdString) {
        console.error('ERRO: Não foi possível encontrar o data-column-id no container de destino.');
        return;
      }

      const newColumnId = parseInt(newColumnIdString, 10);
      const movedCard = event.previousContainer.data[event.previousIndex];

      // Criamos a variável 'updates' com o tipo que corresponde ao que o serviço espera.
      const updates = {
        columnId: newColumnId
      };

      // Agora a chamada da função corresponde perfeitamente à sua definição.
      this.apiService.updateCard(movedCard.id, updates).subscribe({
        next: (updatedCard: Card) => {
          console.log(`SUCESSO: Card ${updatedCard.id} movido para a coluna ${updatedCard.columnId} no backend.`);
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex,
          );
        },
        error: (err: any) => {
          console.error('ERRO: Falha ao atualizar a coluna do card no backend:', err);
          alert('Não foi possível mover o card. A página será recarregada.');
          window.location.reload();
        }
      });
    }
  }
  

  deleteCard(columnId: string, cardIndex: number) {
    const column = this.columns.find(c => c.id === columnId);
    if (column && column.cards[cardIndex]) {
      const cardIdToDelete = column.cards[cardIndex].id;
      // ✅ CORREÇÃO 5: Adicionamos o tipo para 'err'
      this.apiService.deleteCard(cardIdToDelete).subscribe({
        next: () => {
          console.log(`Card com ID ${cardIdToDelete} excluído.`);
          column.cards.splice(cardIndex, 1);
        },
        error: (err: any) => {
          console.error('Erro ao excluir o card:', err);
          alert('Não foi possível excluir o card.');
        }
      });
    }
  }
  
  // Seus outros métodos para controlar os modais continuam aqui...
  openAddCardModal(columnId: string) { this.isModalVisible = true; this.currentColumnId = columnId; }
  closeModal() { this.isModalVisible = false; this.currentColumnId = null; this.addCardForm.reset({ badge: 'low' }); }
  onAddCard() { if (this.addCardForm.valid && this.currentColumnId) { const dadosParaApi = { title: this.addCardForm.value.title, badge: this.addCardForm.value.badge, columnId: parseInt(this.currentColumnId) }; this.apiService.createCard(dadosParaApi).subscribe((cardCriadoNoBackend: Card) => { const column = this.columns.find(c => c.id === this.currentColumnId); if (column) { const badgeTextMap = { low: 'Prioridade mínima', medium: 'Prioridade média', high: 'Prioridade máxima' }; const cardCompleto = { ...cardCriadoNoBackend, badgeText: badgeTextMap[cardCriadoNoBackend.badge] }; column.cards.push(cardCompleto); } this.closeModal(); }); } }
  openAddColumnModal() { this.isAddColumnModalVisible = true; }
  closeAddColumnModal() { this.isAddColumnModalVisible = false; this.addColumnForm.reset(); }
  openDeleteColumnModal(columnIndex: number) { this.columnIndexToDelete = columnIndex; this.isDeleteColumnModalVisible = true; }
  closeDeleteColumnModal() { this.isDeleteColumnModalVisible = false; this.columnIndexToDelete = null; }
}