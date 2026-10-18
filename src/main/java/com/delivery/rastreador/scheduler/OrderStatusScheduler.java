package com.delivery.rastreador.scheduler;

import com.delivery.rastreador.model.Order;
import com.delivery.rastreador.model.OrderStatus;
import com.delivery.rastreador.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Component
public class OrderStatusScheduler {

    private static final Logger log = LoggerFactory.getLogger(OrderStatusScheduler.class);
    private final OrderRepository orderRepository;
    private final Random random = new Random();

    public OrderStatusScheduler(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Scheduled(fixedDelayString = "${app.scheduler.status-interval-ms:20000}")
    @Transactional
    public void advanceOrderStatusesRandomly() {
        List<OrderStatus> activeStatuses = List.of(
            OrderStatus.RECEBIDO, 
            OrderStatus.EM_PREPARO, 
            OrderStatus.SAIU_PARA_ENTREGA
        );

        List<Order> eligibleOrders = orderRepository.findByStatusIn(activeStatuses);

        if (eligibleOrders.isEmpty()) {
            return;
        }

        for (Order order : eligibleOrders) {
            if (random.nextBoolean()) {
                OrderStatus nextStatus = computeNextStatus(order.getStatus());
                if (nextStatus != order.getStatus()) {
                    log.info("Atualizando pedido #{} de {} para {}", order.getId(), order.getStatus(), nextStatus);
                    order.setStatus(nextStatus);
                    order.setUpdatedAt(LocalDateTime.now());
                    orderRepository.save(order);
                }
            }
        }
    }

    private OrderStatus computeNextStatus(OrderStatus current) {
        int chance = random.nextInt(100);

        switch (current) {
            case RECEBIDO:
                return (chance < 15) ? OrderStatus.CANCELADO : OrderStatus.EM_PREPARO;
            case EM_PREPARO:
                return (chance < 10) ? OrderStatus.CANCELADO : OrderStatus.SAIU_PARA_ENTREGA;
            case SAIU_PARA_ENTREGA:
                return (chance < 5) ? OrderStatus.CANCELADO : OrderStatus.ENTREGUE;
            default:
                return current;
        }
    }
}
