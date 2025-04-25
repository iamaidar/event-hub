import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GroupChatMessageService } from "./group-chat-message.service";
import { CreateGroupChatMessageDto } from "./dto/create-group-chat-message.dto";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class GroupChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly groupChatService: GroupChatMessageService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage("send_message")
  async handleMessage(
    @MessageBody() data: CreateGroupChatMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const saved = await this.groupChatService.createMessage(data);

    this.server.to(`group_${data.groupId}`).emit("new_message", {
      ...saved,
      user: {
        id: saved.user.id,
        username: saved.user.username,
      },
    });
  }

  @SubscribeMessage("join_group")
  handleJoinGroup(
    @MessageBody() groupId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`group_${groupId}`);
    console.log(`Client ${client.id} joined group ${groupId}`);
  }
}
