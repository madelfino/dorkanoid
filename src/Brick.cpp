#include "Brick.h"

Brick::Brick() :
       Entity(),
       HP(1)
{

}

Brick::Brick(int _HP, sf::Sprite _sprite) :
       Entity(_sprite),
       HP(_HP)
{

}

void Brick::collide()
{
    --HP;
}

bool Brick::isDead()
{
    return (HP > 0);
}
