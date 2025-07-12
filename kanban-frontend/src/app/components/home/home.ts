// Imports de bibliotecas e do Angular
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin, map, switchMap } from 'rxjs';
import { ApiService } from '../../services/api';

// --- Interfaces de Modelo ---
// Definem a "forma" dos nossos dados, garantindo consistência.
interface Card {
  id: number;
  columnId: number;
  title: string;
  badge: 'low' | 'medium' | 'high';
  badgeText: string; // Esta propriedade é adicionada no frontend para exibição.
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
  styleUrls: ['./home.css']      
})


export class Home implements OnInit {
  // Propriedade para armazenar as colunas e seus cards
  columns: Column[] = [];

  //Notificação de quando acontecer algun erro
  notification = {
  message: '',
  type: 'error', 
  isVisible: false
  };

  /**
 * Exibe uma notificação customizada na tela.
 * @param message - A mensagem a ser exibida.
 * @param type - O tipo de notificação ('success' ou 'error').
 */
    showNotification(message: string, type: 'success' | 'error'): void {
    this.notification = { message, type, isVisible: true };

    // Esconde a notificação automaticamente após 3 segundos.
    setTimeout(() => {
      this.notification.isVisible = false;
    }, 3000);
}

  // Propriedades para controlar a visibilidade e os dados dos modais
  isModalVisible = false;
  isAddColumnModalVisible = false;
  isDeleteColumnModalVisible = false;
  
  // Propriedades para armazenar o estado temporário durante uma ação
  currentColumnId: string | null = null;
  columnIndexToDelete: number | null = null;
  
  // Propriedades para os formulários reativos do Angular
  addCardForm: FormGroup;
  addColumnForm: FormGroup;

  /**
   * O construtor é usado para injetar dependências que a classe necessita.
   * @param fb - FormBuilder, um serviço para criar formulários complexos.
   * @param apiService - serviço customizado para se comunicar com o backend.
   */
  constructor(private fb: FormBuilder, private apiService: ApiService) {
    // Inicialização dos formulários no construtor
    this.addCardForm = this.fb.group({
      title: ['', Validators.required],
      badge: ['low', Validators.required]
    });
    
    this.addColumnForm = this.fb.group({
      title: ['', Validators.required]
    });
  }

  /**
   * ngOnInit é um "gancho de ciclo de vida" do Angular.
   * Ele é executado uma única vez, quando o componente é inicializado.
   * É o local ideal para buscar os dados iniciais da nossa aplicação.
   */
  ngOnInit(): void {
    this.loadInitialData();
  }

  /**
   * Carrega os dados iniciais do quadro: busca as colunas e, em seguida,
   * busca os cards para cada uma dessas colunas de forma otimizada.
   */
  loadInitialData(): void {
    const boardId = 1; // Usando um ID de quadro fixo por enquanto.

    this.apiService.getColumns(boardId).pipe(
      // O 'switchMap' cancela a requisição anterior se uma nova for feita, evitando condições de corrida.
      // Ele pega o resultado do getColumns (o array de colunas) e o passa para a próxima etapa.
      switchMap((columnsFromBackend: any[]) => {
        // Mapeamos as colunas para o formato que nosso frontend usa.
        this.columns = columnsFromBackend.map(col => ({
          id: col.id.toString(),
          name: col.name,
          cards: []
        }));

        // Se não houver colunas, retornamos um array vazio para não quebrar o forkJoin.
        if (this.columns.length === 0) {
          return [];
        }

        // Criamos um array de "observables" (requisições) para buscar os cards de cada coluna.
        const cardRequests = this.columns.map(column => 
          this.apiService.getCards(parseInt(column.id)).pipe(
            // O 'map' do RxJS transforma a resposta da API antes de ela chegar no subscribe.
            map(cardsFromBackend => ({
              columnId: column.id,
              cards: cardsFromBackend.map(card => this.mapCardData(card))
            }))
          )
        );

        // O 'forkJoin' executa todas as requisições de cards em paralelo e só continua
        // quando TODAS elas tiverem sido concluídas com sucesso. É muito mais eficiente.
        return forkJoin(cardRequests);
      })
    ).subscribe(results => {
      // O 'results' é um array com os resultados de todas as buscas de cards.
      // Ex: [{ columnId: '1', cards: [...] }, { columnId: '2', cards: [...] }]
      results.forEach(result => {
        const columnIndex = this.columns.findIndex(col => col.id === result.columnId);
        if (columnIndex !== -1) {
          this.columns[columnIndex].cards = result.cards;
        }
      });
      console.log('Dados iniciais carregados com sucesso!', this.columns);
    });
  }

  /**
   * Lida com o evento de "soltar" um card em uma lista (cdkDropList).
   * @param event - O objeto do evento CdkDragDrop, contendo informações sobre o arraste.
   */
  drop(event: CdkDragDrop<Card[]>): void {
    if (event.previousContainer === event.container) {
      // Movendo o card dentro da mesma coluna.
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Movendo o card para uma nova coluna.
      this.handleCardDropInNewColumn(event);
    }
  }

  /**
   * Função auxiliar para lidar com a lógica de mover um card para uma nova coluna,
   * incluindo a chamada à API para persistir a mudança.
   * @param event - O objeto do evento CdkDragDrop.
   */
  private handleCardDropInNewColumn(event: CdkDragDrop<Card[]>): void {
    const newColumnIdString = (event.container.element.nativeElement as HTMLElement).dataset['columnId'];

    if (!newColumnIdString) {
      console.error('ERRO: Não foi possível encontrar o data-column-id no container de destino.');
      return;
    }

    const newColumnId = parseInt(newColumnIdString, 10);
    const movedCard = event.previousContainer.data[event.previousIndex];

    this.apiService.updateCard(movedCard.id, { columnId: newColumnId }).subscribe({
      next: updatedCard => {
        console.log(`SUCESSO: Card ${updatedCard.id} movido para a coluna ${updatedCard.columnId} no backend.`);
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      },
      error: err => {
        console.error('ERRO: Falha ao atualizar a coluna do card no backend:', err);
        this.showNotification('Não foi possível mover o card. Tente novamente.', 'error');
      }
    });
  }

  /**
   * Adiciona um novo card ao quadro. Chamado pelo formulário do modal.
   */
  onAddCard(): void {
    if (!this.addCardForm.valid || !this.currentColumnId) {
      return;
    }

    const cardData = {
      title: this.addCardForm.value.title,
      badge: this.addCardForm.value.badge,
      columnId: parseInt(this.currentColumnId, 10)
    };

    this.apiService.createCard(cardData).subscribe(newCardFromBackend => {
      const column = this.columns.find(c => c.id === this.currentColumnId);
      if (column) {
        // Usamos nossa função auxiliar para evitar repetir a lógica.
        column.cards.push(this.mapCardData(newCardFromBackend));
      }
      this.closeModal();
    });
  }
  
  /**
   * Exclui um card do quadro.
   * @param columnId - A ID da coluna onde o card está.
   * @param cardId - A ID do card a ser excluído.
   */
  deleteCard(columnId: string, cardId: number): void {
    this.apiService.deleteCard(cardId).subscribe({
      next: () => {
        console.log(`Card com ID ${cardId} excluído com sucesso.`);
        const column = this.columns.find(c => c.id === columnId);
        if (column) {
          // Remove o card da lista local para atualizar a tela.
          const cardIndex = column.cards.findIndex(card => card.id === cardId);
          if (cardIndex !== -1) {
            column.cards.splice(cardIndex, 1);
          }
        }
      },
     error: (err: any) => {
        console.error('Erro ao excluir o card:', err);
        // Em vez de alert(), chamamos nossa nova função de notificação.
        this.showNotification('Não foi possível excluir o card.', 'error');
      }
    });
  }

  /**
   * Adiciona uma nova coluna ao quadro.
   */
  onAddColumn(): void {
    if (!this.addColumnForm.valid) {
      return;
    }
    const columnData = {
      name: this.addColumnForm.value.title,
      boardId: 1 // Usando um ID de quadro fixo
    };
    this.apiService.createColumn(columnData).subscribe(newColumnFromBackend => {
      this.columns.push({
        id: newColumnFromBackend.id.toString(),
        name: newColumnFromBackend.name,
        cards: []
      });
      this.closeAddColumnModal();
    });
  }

  /**
   * Confirma e executa a exclusão de uma coluna.
   */
  confirmDeleteColumn(): void {
    if (this.columnIndexToDelete === null) {
      return;
    }
    const columnToDelete = this.columns[this.columnIndexToDelete];
    const columnId = parseInt(columnToDelete.id, 10);
    
    this.apiService.deleteColumn(columnId).subscribe(() => {
      // Usamos o ID aqui, não o índice, para garantir que estamos deletando a coluna certa.
      const index = this.columns.findIndex(col => parseInt(col.id, 10) === columnId);
      if(index !== -1){
        this.columns.splice(index, 1);
      }
      this.closeDeleteColumnModal();
    });
  }

  // --- Funções Auxiliares e de Controle de Modal ---
  
  /**
   * Função auxiliar para mapear dados de um card do backend para o formato do frontend,
   * adicionando a propriedade 'badgeText' que não vem da API.
   * @param cardData - Os dados do card vindos do backend.
   * @returns Um objeto Card completo para o frontend.
   */
  private mapCardData(cardData: any): Card {
    const badgeTextMap = {
      low: 'Prioridade mínima',
      medium: 'Prioridade média',
      high: 'Prioridade máxima'
    };
    return {
      ...cardData,
      badgeText: badgeTextMap[cardData.badge as 'low' | 'medium' | 'high'] || ''
    };
  }

  openAddCardModal(columnId: string): void {
    this.isModalVisible = true;
    this.currentColumnId = columnId;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.currentColumnId = null;
    this.addCardForm.reset({ badge: 'low' });
  }

  openAddColumnModal(): void {
    this.isAddColumnModalVisible = true;
  }

  closeAddColumnModal(): void {
    this.isAddColumnModalVisible = false;
    this.addColumnForm.reset();
  }

  openDeleteColumnModal(columnIndex: number): void {
    this.columnIndexToDelete = columnIndex;
    this.isDeleteColumnModalVisible = true;
  }

  closeDeleteColumnModal(): void {
    this.isDeleteColumnModalVisible = false;
    this.columnIndexToDelete = null;
  }
}