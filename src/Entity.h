#ifndef ENTITY_H
#define ENTITY_H

#include <SFML/Graphics.hpp>

class Entity
{
private:
    sf::Sprite sprite;

public:
    Entity() {}
    Entity(sf::Sprite _sprite);
    virtual void draw() = 0;
    virtual void update() = 0;
};

#endif
