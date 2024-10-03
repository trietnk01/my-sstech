import { Column, Entity, JoinColumn, ObjectId, ObjectIdColumn, OneToMany } from "typeorm";

@Entity({ name: "users" })
export class Users {
  @ObjectIdColumn()
  _id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  display_name: string;

  @Column()
  token: string;
}
