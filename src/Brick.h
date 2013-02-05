#ifndef BRICK_H
#define BRICK_H

#include "Entity.h"

class Brick : Entity
{
private:

    int HP;

public:

    Brick();
    Brick( int _HP, sf::Sprite _sprite);
    void collide();
    bool isDead();
};

#endif
