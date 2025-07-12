import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';

/**
 * Agrupa todos os testes de integração para o CardsController.
 */
describe('CardsController', () => {
  let controller: CardsController;
  let service: CardsService;

  // Criamos um "mock" do nosso CardsService para isolar o controller.
  const mockCardsService = {
    // Mock do método findAll: retorna um array com um card de exemplo.
    findAll: jest.fn().mockResolvedValue([
      { id: 1, title: 'Card Mock 1', columnId: 1, badge: 'low' },
    ]),
    // Mock do método create: recebe os dados e retorna um card criado.
    create: jest.fn(dto => ({
      id: Date.now(),
      ...dto,
    })),
    // Adicionamos mocks para os outros métodos para evitar erros de "undefined".
    findOne: jest.fn(id => ({ id, title: 'Card Encontrado', columnId: 1, badge: 'low' })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn(id => ({ message: `Card ${id} removido` })),
  };

  /**
   * Roda antes de cada teste, configurando um ambiente de teste limpo.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      // Provê o nosso mock no lugar do serviço real.
      providers: [
        {
          provide: CardsService,
          useValue: mockCardsService,
        },
      ],
    }).compile();

    controller = module.get<CardsController>(CardsController);
    service = module.get<CardsService>(CardsService); // Instância do mock
  });

  /**
   * Teste 1: Verifica se o controller foi criado com sucesso.
   */
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /**
   * Teste 2: Verifica a rota GET /cards.
   */
  describe('findAll', () => {
    it('should call the service and return an array of cards', async () => {
      // Act: Chama o método do controller.
      const result = await controller.findAll('');

      // Assert: Verifica se o método 'findAll' do nosso serviço MOCK foi chamado.
      expect(service.findAll).toHaveBeenCalled();
      // E verifica se o resultado retornado é o que definimos no nosso mock.
      expect(result).toEqual([
        { id: 1, title: 'Card Mock 1', columnId: 1, badge: 'low' },
      ]);
    });
  });

  /**
   * Teste 3: Verifica a rota POST /cards.
   */
  describe('create', () => {
    it('should call the service to create a new card and return it', async () => {
      // Arrange: Prepara os dados de entrada.
      const createCardDto = {
        title: 'Novo Card de Teste',
        columnId: 1,
        badge: 'high' as const, // 'as const' garante o tipo literal.
      };

      // Act: Chama o método do controller.
      const result = await controller.create(createCardDto);

      // Assert: Verifica se o método 'create' do serviço mock foi chamado com os dados corretos.
      expect(service.create).toHaveBeenCalledWith(createCardDto);
      // E verifica se o resultado tem o título que esperamos.
      expect(result.title).toEqual(createCardDto.title);
    });
  });
});