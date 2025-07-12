import { Test, TestingModule } from '@nestjs/testing';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';

/**
 * Agrupa todos os testes de integração para o ColumnsController.
 */
describe('ColumnsController', () => {
  let controller: ColumnsController;
  let service: ColumnsService;

  // Criamos um "mock" do nosso ColumnsService.
  // Ele é um objeto falso que imita o serviço real, permitindo que controlemos
  // seu comportamento durante os testes.
  const mockColumnsService = {
    // Mock do método findAll: ele simplesmente retorna um array com uma coluna de exemplo.
    findAll: jest.fn().mockResolvedValue([
      { id: 1, name: 'Coluna Mock 1', boardId: 1, cards: [] },
    ]),
    // Mock do método create: ele recebe dados e retorna uma coluna criada.
    create: jest.fn(dto => {
      return {
        id: Date.now(), // Gera uma ID única para o teste
        ...dto,
      };
    }),
    // Adicionamos mocks para os outros métodos para evitar erros, mesmo que não os testemos agora.
    findOne: jest.fn(id => ({ id, name: 'Coluna Encontrada', boardId: 1 })),
    remove: jest.fn(id => ({ message: `Coluna ${id} removida` })),
  };

  /**
   * Roda antes de cada teste.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColumnsController],
      // Aqui está a mágica: em vez de prover o ColumnsService real,
      // nós dizemos ao Nest para usar nosso mock no lugar dele.
      providers: [
        {
          provide: ColumnsService,
          useValue: mockColumnsService,
        },
      ],
    }).compile();

    controller = module.get<ColumnsController>(ColumnsController);
    service = module.get<ColumnsService>(ColumnsService); // Pegamos a instância do mock
  });

  /**
   * Teste 1: Verifica se o controller foi criado.
   */
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /**
   * Teste 2: Verifica a rota GET /columns.
   */
  describe('findAll', () => {
    it('should return an array of columns', async () => {
      // Act: Chamamos o método do controller.
      const result = await controller.findAll('');

      // Assert: Verificamos se o método 'findAll' do nosso serviço MOCK foi chamado.
      expect(service.findAll).toHaveBeenCalled();
      // E verificamos se o resultado retornado é o que definimos no nosso mock.
      expect(result).toEqual([
        { id: 1, name: 'Coluna Mock 1', boardId: 1, cards: [] },
      ]);
    });
  });

  /**
   * Teste 3: Verifica a rota POST /columns.
   */
  describe('create', () => {
    it('should create a new column and return it', async () => {
      // Arrange: Preparamos os dados de entrada.
      const createColumnDto = { name: 'Nova Coluna', boardId: 1 };

      // Act: Chamamos o método do controller.
      const result = await controller.create(createColumnDto);

      // Assert: Verificamos se o método 'create' do serviço mock foi chamado com os dados corretos.
      expect(service.create).toHaveBeenCalledWith(createColumnDto);
      // E verificamos se o resultado tem o nome que esperamos.
      expect(result.name).toEqual(createColumnDto.name);
    });
  });
});